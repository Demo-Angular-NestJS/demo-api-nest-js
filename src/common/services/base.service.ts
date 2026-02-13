import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
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
            throw new ConflictException(`The ${field} is already in use.`);
        }

        switch (error.name) {
            case 'ValidationError':
                throw new BadRequestException(error.message);
            case 'CastError':
                throw new BadRequestException(`Invalid format for field: ${error.path}`);
            case 'NotFoundException':
                throw new NotFoundException('Resource not found for deletion');
            case 'ConflictException':
                throw new ConflictException(error.message);
                break;
            default:
                throw new InternalServerErrorException('An unexpected database error occurred');
        }
    }
}