import { Model, FilterQuery, UpdateQuery, HydratedDocument } from 'mongoose';
import { SearchRequestDTO } from 'common';

export abstract class BaseRepository<T> {
    constructor(protected readonly model: Model<T>) { }

    public async findAll(query: SearchRequestDTO, sensitiveFields: string = '-__v'): Promise<{ data: T[], total: number }> {
        const { filterField, filterValue, page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const filter: Record<string, any> = { isDeleted: { $ne: true } }; //deleted records don't show up in search results by default:

        if (filterField && filterValue) {
            filter[filterField] = { $regex: filterValue, $options: 'i' };
        }

        const [data, total] = await Promise.all([
            this.model
                .find(filter)
                .select(sensitiveFields)
                .sort(sortOptions as any)
                .skip(skip)
                .limit(limit)
                .lean<T[]>()
                .exec(),
            this.model.countDocuments(filter).exec(),
        ]);

        return { data: data as T[], total };
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

    public async delete(filter: FilterQuery<T>): Promise<boolean> {
        const result = await this.model.deleteOne(filter).exec();
        return result.deletedCount > 0;
    }

    public async deleteSoft(filter: FilterQuery<T>): Promise<T | null> {
        return await this.model
            .findOneAndUpdate(filter, { $set: { isDeleted: true } as any }, { new: true })
            .lean<T>()
            .exec();
    }
}