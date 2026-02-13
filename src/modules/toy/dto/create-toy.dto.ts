import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsUrl,
  IsBoolean,
  Min,
  IsMongoId,
  Max
} from 'class-validator';

export class CreateToyDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly productSKU: string;

  @IsString()
  @IsNotEmpty()
  readonly shortDescription?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly tags?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly price?: number;

  @IsMongoId()
  @IsNotEmpty()
  readonly categoryId: string;

  @IsUrl()
  @IsNotEmpty()
  readonly imageUrl: string;

  @IsOptional()
  @IsUrl()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsNotEmpty()
  @IsNumber()
  @Min(0.5)
  @Max(5)
  stars: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly points?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly inStock?: number;

  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
}