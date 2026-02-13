import { Model, FilterQuery, UpdateQuery, HydratedDocument } from 'mongoose';
import { buildDefaultFilter, IBaseRepository, mapFilterCriteria, SearchRequestDTO } from 'common';
import { switchMap } from 'rxjs';
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
            throw new InternalServerErrorException(ex?.message ?? 'error');
        }
    }

    public async findOne(filter: FilterQuery<T>, sensitiveFields: string = '-__v'): Promise<T | null> {
        return await this.model.findOne(filter).select(sensitiveFields).lean<T>().exec();
    }

    public async findById(id: string, sensitiveFields: string = ''): Promise<T | null> {
        return await this.model.findById(id).select(sensitiveFields).lean<T>().exec();
    }

    public async create(data: Partial<T>): Promise<HydratedDocument<T>> {
        const createdDocument = new this.model(data);
        return (await createdDocument.save()) as any;
    }

    public async update(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
        return await this.model
            .findOneAndUpdate(filter, { $set: data }, {
                new: true,
                runValidators: true,
            })
            .lean<T>()
            .exec();
    }

    public async deleteSoft(filter: FilterQuery<T>): Promise<T | null> {
        return await this.model
            .findOneAndUpdate(filter, { $set: { isDeleted: true } as any }, { new: true })
            .lean<T>()
            .exec();
    }

    public async delete(filter: FilterQuery<T>): Promise<boolean> {
        const result = await this.model.deleteOne(filter).exec();
        return result.deletedCount > 0;
    }
}