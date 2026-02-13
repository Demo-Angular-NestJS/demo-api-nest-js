import { Controller } from '@nestjs/common';
import { BaseController } from 'modules/base.controller';
import { Category } from './schema/category.schema';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { CategoryResponseDTO } from './dto/category-response.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController extends BaseController<Category, CreateCategoryDTO, UpdateCategoryDTO, CategoryResponseDTO> {
  constructor(
    private readonly categoryService: CategoryService,
  ) {
    super(categoryService, CategoryResponseDTO);
  }
}
