import { IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateWeatherDto {
  @IsNumber()
  @Min(-50)
  @Max(60)
  temperature: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  humidity: number;

  @IsNumber()
  @Min(0)
  @Max(200)
  windSpeed: number;

  @IsString()
  condition: string;

  @IsString()
  location: string;
}
