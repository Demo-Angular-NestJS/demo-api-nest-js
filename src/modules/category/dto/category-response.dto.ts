import { Expose } from 'class-transformer';
import { BaseEntityModel } from 'common';

export class CategoryResponseDTO extends BaseEntityModel {
    @Expose()
    name: string;

    @Expose()
    slug: string;

    @Expose()
    description: string;
    
    @Expose()
    minAge: number;

    @Expose()
    maxAge: number;

    @Expose()
    educationalFocus: string[];

    @Expose()
    isActive: boolean;

    @Expose()
    isDeleted: boolean;

    constructor(partial: Partial<any>) {
        super();
        this.initialize(partial);
    }
}