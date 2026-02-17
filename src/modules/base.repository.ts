import { Model, FilterQuery, UpdateQuery, HydratedDocument, QueryOptions, Types } from 'mongoose';
import { buildDefaultFilter, IBaseRepository, mapFilterCriteria, SearchRequestDTO } from 'common';
import { InternalServerErrorException } from '@nestjs/common';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
    constructor(protected readonly model: Model<T>) { }

    public async findAll(
        query: SearchRequestDTO,
        sensitiveFields: string = '-__v',
        populateFields: string[] = [],
    ): Promise<{ data: T[], total: number }> {
        try {
            const { searchCriteria, page, itemsPerPage, sortBy, sortOrder } = query;
            const skip = (page - 1) * itemsPerPage;
            let sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
            let filter: Record<string, any> = buildDefaultFilter(this.model);

            if (searchCriteria && searchCriteria.length) {
                const dynamicFilters = mapFilterCriteria(this.model, searchCriteria);
                filter = { ...filter, ...dynamicFilters };
            }

            if (!this.model.schema.paths[sortBy] && !sortBy.includes('.')) {
                sortOptions = {};
            }

            // DEEP SEARCH LOGIC
            // Check if any filter key or sortBy uses a dot (e.g., "category.name")
            const isDeepSearch = Object.keys(filter).some(key => key.includes('.')) || sortBy.includes('.');

            if (isDeepSearch) {
                return await this.executeAggregationSearch(filter, sortOptions, skip, itemsPerPage, sensitiveFields);
            }

            if (!this.model.schema.paths[sortBy]) {
                sortOptions = {};
            };

            //STANDARD SEARCH LOGIC
            const [data, total] = await Promise.all([
                this.model
                    .find(filter)
                    .select(sensitiveFields)
                    .sort(sortOptions as any)
                    .skip(skip)
                    .limit(itemsPerPage)
                    .populate(populateFields)
                    .lean<T[]>()
                    .exec(),
                this.model.countDocuments(filter).exec(),
            ]);

            return { data: data as T[], total };
        } catch (ex) {
            throw new InternalServerErrorException(ex?.message ?? 'Find All operation failed');
        }
    }

    public async findOne(filter: FilterQuery<T>, sensitiveFields: string = '-__v'): Promise<T | null> {
        try {
            return await this.model.findOne(filter).select(sensitiveFields).lean<T>().exec();
        } catch (ex) {
            throw new InternalServerErrorException(ex?.message ?? 'Find One operation failed');
        }
    }

    public async findById(id: string, sensitiveFields: string = ''): Promise<T | null> {
        try {
            return await this.model.findById(id).select(sensitiveFields).lean<T>().exec();
        } catch (ex) {
            throw new InternalServerErrorException(ex?.message ?? 'Find By Id operation failed');
        }
    }

    public async create(data: Partial<T>): Promise<HydratedDocument<T>> {
        try {
            const createdDocument = new this.model(data);
            return (await createdDocument.save()) as any;
        } catch (ex) {
            throw new InternalServerErrorException(ex?.message ?? 'Create operation failed');
        }
    }

    public async upsert(filter: FilterQuery<T>, updateData: UpdateQuery<T>, insertOnlyData: Record<string, any> = {}): Promise<T | null> {
        try {
            const updateQuery: UpdateQuery<T> = {
                $set: updateData,
                $setOnInsert: insertOnlyData
            };
            const options: QueryOptions<T> = {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            };

            return await this.model.findOneAndUpdate(filter, updateQuery, options).lean<T>().exec();
        } catch (ex) {
            throw new InternalServerErrorException(ex?.message ?? 'Upsert operation failed');
        }
    }

    public async update(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
        try {
            const options: QueryOptions<T> = {
                new: true,
                runValidators: true,
            };

            return await this.model.findOneAndUpdate(filter, { $set: data }, options).lean<T>().exec();
        } catch (ex) {
            throw new InternalServerErrorException(ex?.message ?? 'Update operation failed');
        }
    }

    public async deleteSoft(filter: FilterQuery<T>): Promise<T | null> {
        try {
            return await this.model
                .findOneAndUpdate(filter, { $set: { isDeleted: true } as any }, { new: true })
                .lean<T>()
                .exec();
        } catch (ex) {
            throw new InternalServerErrorException(ex?.message ?? 'Delete Soft operation failed');
        }
    }

    public async delete(filter: FilterQuery<T>): Promise<boolean> {
        try {
            const result = await this.model.deleteOne(filter).exec();
            return result.deletedCount > 0;
        } catch (ex) {
            throw new InternalServerErrorException(ex?.message ?? 'Delete operation failed');
        }
    }

    private async executeAggregationSearch(
        filter: Record<string, any>,
        sortOptions: any,
        skip: number,
        limit: number,
        sensitiveFields: string
    ): Promise<{ data: T[], total: number }> {
        const pipeline: any[] = [];
        const processedRelations = new Set<string>();
        const deepFields = Object.keys(filter)
            .filter(key => key.includes('.'))
            .map(key => key.split('.')[0]);

        deepFields.forEach(relationAlias => {
            if (processedRelations.has(relationAlias)) {
                return;
            }

            const localField = `${relationAlias}Id`;
            const schemaPath = this.model.schema.paths[localField] as any;

            if (schemaPath && schemaPath.options.ref) {
                const foreignCollection = schemaPath.options.ref.toLowerCase();

                pipeline.push(
                    {
                        $lookup: {
                            from: foreignCollection,
                            localField: localField,
                            foreignField: '_id',
                            as: relationAlias,
                        },
                    },
                    {
                        $unwind: {
                            path: `$${relationAlias}`,
                            preserveNullAndEmptyArrays: true,
                        },
                    }
                );
                processedRelations.add(relationAlias);
            }
        });

        const castedFilter = this.castFilterTypes(filter);
        pipeline.push({ $match: castedFilter });

        if (Object.keys(sortOptions).length > 0) {
            pipeline.push({ $sort: sortOptions });
        }

        pipeline.push({
            $facet: {
                metadata: [{ $count: 'total' }],
                data: [
                    { $skip: skip },
                    { $limit: limit },
                    { $project: this.convertSelectStringToProject(sensitiveFields) },
                ],
            },
        });

        const result = await this.model.aggregate(pipeline).exec();
        return {
            data: result[0]?.data || [],
            total: result[0]?.metadata[0]?.total || 0
        };
    }

    private castFilterTypes(filter: Record<string, any>): Record<string, any> {
        const casted: Record<string, any> = {};
        Object.keys(filter).forEach(key => {
            let value = filter[key];

            if (typeof value === 'string' && Types.ObjectId.isValid(value)) {
                value = new Types.ObjectId(value);
            }  else if (value && typeof value === 'object' && !('$regex' in value)) {
                const op = Object.keys(value)[0];
                let opVal = value[op];
                if (opVal === 'true' || opVal === true) opVal = true;
                if (opVal === 'false' || opVal === false) opVal = false;
                if (typeof opVal === 'string' && Types.ObjectId.isValid(opVal)) opVal = new Types.ObjectId(opVal);
                value = { [op]: opVal };
            }

            casted[key] = value;
        });
        return casted;
    }

    private convertSelectStringToProject(select: string): Record<string, number> {
        const project: any = {};
        select.split(' ').forEach((field) => {
            if (field.startsWith('-')) {
                project[field.substring(1)] = 0
            } else if (field) {
                project[field] = 1
            };
        });
        return project;
    }
}