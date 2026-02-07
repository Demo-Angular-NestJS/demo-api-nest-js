import { Expose } from 'class-transformer';
import { BaseEntityModel } from 'common';

export class UserResponseDTO extends BaseEntityModel {
    @Expose()
    userName: string;

    @Expose()
    email: string;

    @Expose()
    isActive: boolean;

    @Expose()
    isAdmin: boolean;

    constructor(partial: Partial<any>) {
        super();
        this.initialize(partial);
    }
}