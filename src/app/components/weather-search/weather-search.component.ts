import { Component } from '@angular/core';
import { Weather } from '../../services/weather/weather';
import { IWeather } from '../../models/weather.model';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-weather-search',
  templateUrl: './weather-search.component.html',
  styleUrls: ['./weather-search.component.css'],
  imports: [JsonPipe],
})
export class WeatherSearchComponent {
  city: string = '';
  weatherData: IWeather | null = null;
  error: string | null = null;

  constructor(private weatherService: Weather) {}

  async searchWeather() {
    this.error = null;
    try {
      this.weatherData = await this.weatherService.getWeather(this.city);
    } catch (err) {
      this.error = 'Failed to fetch weather data. Please try again.';
    }
  }
}