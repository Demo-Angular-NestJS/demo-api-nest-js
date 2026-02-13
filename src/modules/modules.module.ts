import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserConfigurationModule } from './user-configuration/user-configuration.module';
import { CategoryModule } from './category/category.module';
import { ToyModule } from './toy/toy.module';

@Global()
@Module({
    imports: [
        AuthModule,
        UserModule,
        UserConfigurationModule,
        CategoryModule,
        ToyModule,
    ],
})
export class ModulesModule { }