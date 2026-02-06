import { Expose } from 'class-transformer';

export class CheckExistenceResponseDTO {
    @Expose()
    userNameExist: boolean;

    @Expose()
    emailExist: boolean;

    constructor(partial: Partial<any>) {
        if (partial) {
            const data = partial._doc ? partial._doc : partial;
            Object.assign(this, data);
        }
    }
}