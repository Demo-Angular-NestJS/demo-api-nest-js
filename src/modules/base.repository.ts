import { Model, FilterQuery, UpdateQuery, HydratedDocument, QueryOptions } from 'mongoose';
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

            if (!this.model.schema.paths[sortBy]) {
                sortOptions = {};
            }


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
}