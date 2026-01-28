import { Expose, Transform } from 'class-transformer';

export class UserResponseDTO {
    @Expose()
    @Transform(({ obj }) => obj._id?.toString()) // Explicitly map _id to id
    id: string;

    @Expose()
    userName: string;

    @Expose()
    email: string;

    @Expose()
    isActive: boolean;

    @Expose()
    isAdmin: boolean;

    constructor(partial: Partial<UserResponseDTO>) {
        Object.assign(this, partial);
    }
}