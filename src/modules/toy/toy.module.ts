import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Toy, ToySchema } from './schemas/toy.schema';
import { ToyController } from './toy.controller';
import { ToyService } from './toy.service';
import { ToyRepository } from './toy.repository';
import { CategoryModule } from 'modules/category/category.module';


@Module({
  imports: [
    CategoryModule,
    MongooseModule.forFeature([
      { name: Toy.name, schema: ToySchema },
    ]),
  ],
  controllers: [ToyController],
  providers: [ToyService, ToyRepository],
  exports: [MongooseModule, ToyService],
})
export class ToyModule { }
