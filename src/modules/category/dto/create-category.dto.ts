import { IsString, IsOptional, IsMongoId, IsNumber, IsArray, Min, Max, IsBoolean } from 'class-validator';

export class CreateCategoryDTO {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    minAge?: number;

    @IsOptional()
    @IsNumber()
    @Max(99)
    maxAge?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    educationalFocus?: string[];

    @IsOptional()
    @IsBoolean()
    isActive: boolean;

    @IsOptional()
    @IsBoolean()
    isDeleted: boolean;
}