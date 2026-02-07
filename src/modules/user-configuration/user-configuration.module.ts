import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserConfiguration, UserConfigurationSchema } from './schemas/user-configuration.schema';
import { UserConfigurationService } from './user-configuration.service';
import { UserConfigurationRepository } from './user-configuration.repository';
import { UserConfigurationController } from './user-configuration.controller';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserConfiguration.name, schema: UserConfigurationSchema }]),
  ],
  controllers: [UserConfigurationController],
  providers: [UserConfigurationService, UserConfigurationRepository],
  exports: [UserConfigurationService],
})
export class UserConfigurationModule {}
