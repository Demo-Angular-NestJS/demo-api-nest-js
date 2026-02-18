import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'modules/user/user.module';
import { Favorite, FavoriteSchema } from './schemas/favorite.schema';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { FavoriteRepository } from './favorite.repository';
import { ToyModule } from 'modules/toy/toy.module';

@Module({
  imports: [
    ToyModule,
    UserModule,
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema },
    ]),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepository],
  exports: [MongooseModule, FavoriteService],
})
export class FavoriteModule { }
