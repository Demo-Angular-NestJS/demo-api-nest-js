import { Expose, Transform } from 'class-transformer';

export class UserResponseDTO {
    @Expose()
    @Transform(({ obj }) => obj._id?.toString() || obj.id?.toString())
    id: string;

    @Expose()
    userName: string;

    @Expose()
    email: string;

    @Expose()
    isActive: boolean;

    @Expose()
    isAdmin: boolean;

    @Expose()
    createdBy: string;
    
    @Expose()
    createdAt: Date;
    
    @Expose() 
    updatedBy: string;
    
    @Expose()
    updatedAt: Date;

    constructor(partial: Partial<any>) {
        if (partial) {
            const data = partial._doc ? partial._doc : partial;
            Object.assign(this, data);
        }
    }
}