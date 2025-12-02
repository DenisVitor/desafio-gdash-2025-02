import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WeatherModule } from './weather/weather.module';
import * as dotenv from 'dotenv';

dotenv.config({path: "../.env"});

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL!),
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: '24h' },
    }),
    AuthModule,
    UsersModule,
    WeatherModule,
  ],
})
export class AppModule {}
