import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFavoriteDTO {
    @IsMongoId()
    @IsNotEmpty()
    toyId: string;

    @IsString()
    @IsOptional()
    personalNote?: string;
}