
import { Injectable } from '@nestjs/common';
import { BaseService } from 'common/services/base.service';
import { Category } from './schema/category.schema';
import { CategoryResponseDTO } from './dto/category-response.dto';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService extends BaseService<Category, CategoryResponseDTO> {
  constructor(
    protected readonly categoryRepository: CategoryRepository,
  ) {
    super(categoryRepository, CategoryResponseDTO);
  }
}
