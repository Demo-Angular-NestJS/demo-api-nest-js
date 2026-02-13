import { PartialType } from '@nestjs/mapped-types';
import { CreateToyDTO } from './create-toy.dto';

export class UpdateToyDTO extends PartialType(CreateToyDTO) { }