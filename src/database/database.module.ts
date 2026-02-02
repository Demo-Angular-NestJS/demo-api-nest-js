import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        dbName: config.get<string>('MONGODB_DB_NAME'),
        // PERFORMANCE: Connection pool tuning
        maxPoolSize: 100, // Handle high concurrent requests
        minPoolSize: 10, // Keep some connections ready to reduce latency
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        // Optional: autoIndex: false in production for faster startup
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('MongoDB connected successfully');
          });

          connection.on('error', (error: any) => {
            console.error('MongoDB connection failed:', error);
          });

          return connection;
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
