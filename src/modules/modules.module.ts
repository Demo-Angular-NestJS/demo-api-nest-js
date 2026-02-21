import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserConfigurationModule } from './user-configuration/user-configuration.module';
import { CategoryModule } from './category/category.module';
import { ToyModule } from './toy/toy.module';
import { FavoriteModule } from './favorite/favorite.module';
import { CustomMailerModule } from './custom-mailer.module';

@Global()
@Module({
    imports: [
        CustomMailerModule,
        AuthModule,
        UserModule,
        UserConfigurationModule,
        CategoryModule,
        ToyModule,
        FavoriteModule,
    ],
    exports: [
        CustomMailerModule,
        AuthModule,
        UserModule,
        UserConfigurationModule,
        CategoryModule,
        ToyModule,
        FavoriteModule,
    ]
})
export class ModulesModule { }