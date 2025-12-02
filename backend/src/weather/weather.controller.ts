import { Controller, Post, Get, Body, Res } from '@nestjs/common';
import { WeatherService } from './weather.service';

import { CreateWeatherDto } from '../weather/dto/create-weather.dto';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Post('logs')
  create(@Body() createWeatherDto: CreateWeatherDto) {
    return this.weatherService.createWeatherLog(createWeatherDto);
  }

  @Get('logs')
  findAll() {
    return this.weatherService.findAllWeatherLogs();
  }

  @Get('insights')
  getInsights() {
    return this.weatherService.generateInsights();
  }

  @Get('export.csv')
  async exportCsv(@Res() res: any) {
    const csvData = await this.weatherService.exportData('csv');
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="weather-data-${new Date().toISOString().split('T')[0]}.csv"`,
    });
    res.send(csvData);
  }

  @Get('export.xlsx')
  async exportXlsx(@Res() res: any) {
    const xlsxData = await this.weatherService.exportData('xlsx');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="weather-data-${new Date().toISOString().split('T')[0]}.xlsx"`,
    });
    res.send(Buffer.from(xlsxData, 'base64'));
  }
}
