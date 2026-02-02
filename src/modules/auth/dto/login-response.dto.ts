import { Expose, Transform } from 'class-transformer';

export class LoginResponseDTO {
    @Expose()
    @Transform(({ obj }) => obj._id?.toString())
    id: string;

    @Expose()
    userName: string;

    @Expose()
    email: string;

    constructor(partial: Partial<any>) {
        Object.assign(this, partial);
    }
}