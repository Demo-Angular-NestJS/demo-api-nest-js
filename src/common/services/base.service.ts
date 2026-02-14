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

        const transformedData = plainToInstance(this.dtoClass, data, {
            excludeExtraneousValues: true,
        });

        return { data: transformedData, total };
    }

    public async getByFilter(filter: Partial<T>): Promise<DTO> {
        const entity = await this.repository.findOne(filter);

        if (!entity) {
            const filterStr = JSON.stringify(filter);
            throw new NotFoundException(`Resource with criteria ${filterStr} not found`);
        }

        return plainToInstance(this.dtoClass, entity, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
        });
    }

    public async create(inputDto: any, userId?: string): Promise<DTO> {
        try {
            inputDto = {
                ...inputDto,
                createdBy: userId || null,
            };

            const entity = await this.repository.create(inputDto);

            return plainToInstance(this.dtoClass, entity, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });
        } catch (error) {
            this.handleDatabaseErrors(error);
        }
    }

    public async upsert(filter: Record<string, any>, inputDto: any, userId?: string): Promise<DTO> {
        try {
            const updateData = {
                ...inputDto,
                updatedBy: userId || null,
            };

            const insertOnlyData = {
                createdBy: userId || null,
            };

            const entity = await this.repository.upsert(filter, updateData, insertOnlyData);

            return plainToInstance(this.dtoClass, entity, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });
        } catch (error) {
            this.handleDatabaseErrors(error);
        }
    }

    public async update(filter: Record<string, any>, inputDto: any, userId?: string): Promise<DTO> {
        try {
            inputDto = {
                ...inputDto,
                updatedBy: userId,
            };

            const entity = await this.repository.update(filter, inputDto);

            if (!entity) {
                throw new NotFoundException(`Resource not found for update with criteria ${JSON.stringify(filter)}`);
            }

            return plainToInstance(this.dtoClass, entity, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });
        } catch (error) {
            this.handleDatabaseErrors(error);
        }
    }

    public async deleteSoft(filter: Record<string, any>): Promise<boolean> {
        try {
            const deleted = await this.repository.deleteSoft(filter);

            if (!deleted) {
                throw new NotFoundException(
                    `Resource not found for deletion with criteria ${JSON.stringify(filter)}`
                );
            }

            return true;
        } catch (error) {
            this.handleDatabaseErrors(error);
        }
    }

    public async delete(filter: Record<string, any>): Promise<boolean> {
        try {
            const deleted = await this.repository.delete(filter);

            if (!deleted) {
                throw new NotFoundException(
                    `Resource not found for deletion with criteria ${JSON.stringify(filter)}`
                );
            }

            return true;
        } catch (error) {
            this.handleDatabaseErrors(error);
        }
    }

    private handleDatabaseErrors(error: any): never {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const readableField = formatStringName(field);

            throw new ConflictException(
                `${readableField} is already registered. Please use a different value.`
            );
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
                console.log('===> ', error.message);
                throw new InternalServerErrorException('Something went wrong on our end. Please try again in a few moments.');
        }
    }
}