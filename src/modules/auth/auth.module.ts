import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../user/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserRepository } from '../user/user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.JWT_ACCESS_SECRET,
        signOptions: { expiresIn: '15min' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy, RefreshJwtStrategy],
  exports: [AuthService], // Export service if AuthModule needs it
})
export class AuthModule { }
