import { Expose, Transform } from 'class-transformer';
import { BaseEntityModel } from 'common';

export class UserConfigResponseDTO extends BaseEntityModel {
    @Expose()
    @Transform(({ obj }) => obj.userId?.toString())
    userId: string;

    @Expose()
    enableEmailNotifications: boolean;

    @Expose()
    enableOrderStatus: boolean;

    @Expose()
    systemTimeZone: string;

    constructor(partial: Partial<any>) {
        super();
        this.initialize(partial);
    }
}