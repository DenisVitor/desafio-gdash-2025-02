import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherLog, WeatherLogSchema } from '../schemas/weather-log.schema';
import { Insight, InsightSchema } from '../schemas/insight.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: WeatherLog.name, schema: WeatherLogSchema },
    { name: Insight.name, schema: InsightSchema },
  ])],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
 