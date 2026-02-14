import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserConfigurationRepository } from 'modules/user-configuration/user-configuration.repository';
import { UserConfigurationModule } from 'modules/user-configuration/user-configuration.module';

@Module({
  imports: [
    UserConfigurationModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserConfigurationRepository],
  exports: [MongooseModule, UserService],
})
export class UserModule {}
