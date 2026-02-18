import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { formatStringName } from 'common/helper';
import type { IBaseRepository, IBaseService } from 'common/interface';

@Injectable()
export abstract class BaseService<T, DTO> implements IBaseService<DTO> {
    constructor(
        protected readonly repository: IBaseRepository<T>,
        protected readonly dtoClass: new (...args: any[]) => DTO,
    ) { }

    public async search(query: any): Promise<{ data: DTO[], total: number }> {
        const { data, total } = await this.repository.findAll(query);
        return { data: this.transformMany(data), total };
    }

    public async getByFilter(filter: Partial<T>): Promise<DTO> {
        const entity = await this.repository.findOne(filter);

        if (!entity) {
            throw new NotFoundException(`Resource not found for the given criteria.`);
        }

        return this.transform(entity);
    }

    public async getById(id: string, sensitiveFields: string = ''): Promise<DTO> {
        try {
            const entity = await this.repository.getById(id, sensitiveFields);

            if (!entity) {
                throw new NotFoundException(`Resource with ID ${id} not found.`);
            }

            return this.transform(entity);
        } catch (error) {
            this.handleDatabaseErrors(error);
        }
    }

    public async create(inputDto: any, userId?: string): Promise<DTO> {
        try {
            const data = { ...inputDto, createdBy: userId || null };
            const entity = await this.repository.create(data);
            return this.transform(entity);
        } catch (error) {
            this.handleDatabaseErrors(error);
        }
    }

    public async upsert(filter: Record<string, any>, inputDto: any, userId?: string): Promise<DTO> {
        try {
            const { createdBy, ...restOfDto } = inputDto;
            const updateData = {
                ...restOfDto,
                updatedBy: userId || null
            };
            const insertOnlyData = {
                createdBy: userId || null
            };
            const entity = await this.repository.upsert(filter, updateData, insertOnlyData);

            return this.transform(entity);
        } catch (error) {
            this.handleDatabaseErrors(error);
        }
    }

    public async update(filter: Record<string, any>, inputDto: any, userId?: string): Promise<DTO> {
        try {
            const data = { ...inputDto, updatedBy: userId || null };
            const entity = await this.repository.update(filter, data);

            if (!entity) {
                throw new NotFoundException('Resource not found for update.');
            }

            return this.transform(entity);
        } catch (error) {
            this.handleDatabaseErrors(error);
        }
    }

    public async delete(filter: Record<string, any>, soft: boolean = false): Promise<boolean> {
        try {
            const deleted = soft
                ? await this.repository.deleteSoft(filter)
                : await this.repository.delete(filter);

            if (!deleted) {
                throw new NotFoundException('Resource not found for deletion.');
            }

            return true;
        } catch (error) {
            this.handleDatabaseErrors(error);
        }
    }

    protected transform(data: any): DTO {
        const plainData = data.toObject ? data.toObject() : data;

        return plainToInstance(this.dtoClass, plainData, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
        });
    }

    protected transformMany(data: any[]): DTO[] {
        return (data || []).map(item => this.transform(item));
    }

    private handleDatabaseErrors(error: any): never {
        if (error instanceof NotFoundException || error instanceof ConflictException || error instanceof BadRequestException) {
            throw error;
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            throw new ConflictException(`${formatStringName(field)} is already registered.`);
        }

        switch (error.name) {
            case 'ValidationError':
                const messages = Object.values(error.errors).map((err: any) => {
                    if (err.kind === 'required') {
                        const friendlyField = formatStringName(err.path);
                        return `The field "${friendlyField}" is mandatory.`;
                    }
                    return err.message;
                });

                throw new BadRequestException({
                    message: 'Data validation failed',
                    errors: messages
                });
            case 'CastError':
                const path = formatStringName(error.path);
                throw new BadRequestException(`The value provided for "${path}" is invalid. Please check the format.`);
            case 'DocumentNotFoundError':
            case 'NotFoundException':
                throw new NotFoundException('We couldn’t find the record you’re looking for. It may have been moved or deleted.');
            case 'ConflictException':
                throw new ConflictException(error.message);
            default:
                throw new InternalServerErrorException('An unexpected error occurred.');
        }
    }
}