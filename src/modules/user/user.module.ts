import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserConfiguration, UserConfigurationSchema } from 'modules/user-configuration/schemas/user-configuration.schema';
import { UserConfigurationRepository } from 'modules/user-configuration/user-configuration.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserConfiguration.name, schema: UserConfigurationSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserConfigurationRepository],
  exports: [UserService],
})
export class UserModule {}
