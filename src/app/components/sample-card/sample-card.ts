import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IWeather } from '../../models/weather.model';
import { WeatherSearch } from '../weather-search/weather-search';

@Component({
  selector: 'app-sample-card',
  imports: [CommonModule],
  templateUrl: './sample-card.html',
  styleUrl: './sample-card.css',
})
export class SampleCard {
  readonly weatherData = input<IWeather>();
  readonly isMetric = signal(true);
  public readonly showHistory = signal<boolean>(false);
  public readonly searchHistory = signal<string[]>([]);

  private weatherSearch = new WeatherSearch();

  constructor() {
    this.loadWeatherSearchHistory();
  }

  setMetric(value: boolean): void {
    try {
      this.isMetric.set(value);
    } catch (error) {
      console.error('Error setting metric value:', error);
    }
  }

  getTemperature(): string {
    try {
      const temp = this.weatherData()?.main?.temp;
      if (temp === undefined || temp === null) return '--';

      if (this.isMetric()) {
        // Convert Kelvin to Celsius
        const celsius = temp - 273.15;
        return celsius.toFixed(1);
      } else {
        // Convert Kelvin to Fahrenheit
        const fahrenheit = ((temp - 273.15) * 9) / 5 + 32;
        return fahrenheit.toFixed(1);
      }
    } catch (error) {
      console.error('Error getting temperature:', error);
      return '--';
    }
  }

  getWindSpeed(): string {
    try {
      const speed = this.weatherData()?.wind?.speed;
      if (speed === undefined || speed === null) return '--';

      if (this.isMetric()) {
        return speed.toFixed(1);
      } else {
        // Convert km/h to mph
        const mph = speed * 0.621371;
        return mph.toFixed(1);
      }
    } catch (error) {
      console.error('Error getting wind speed:', error);
      return '--';
    }
  }
  getSunSetTime(): string {
    try {
      const sunset = this.weatherData()?.sys?.sunset;
      if (!sunset) return '--';
      // Assuming `sunset` is a timestamp
      const date = new Date(sunset * 1000);
      return date.toLocaleTimeString();
    } catch (error) {
      console.error('Error getting sunset time:', error);
      return '--';
    }
  }
  getSunriseTime(): string {
    try {
      const sunrise = this.weatherData()?.sys?.sunrise;
      if (!sunrise) return '--';
      // Assuming `sunrise` is a timestamp
      const date = new Date(sunrise * 1000);
      return date.toLocaleTimeString();
    } catch (error) {
      console.error('Error getting sunrise time:', error);
      return '--';
    }
  }

  getWeatherIcon(): string {
    try {
      const icon = this.weatherData()?.weather?.[0]?.icon;
      if (!icon) return '';
      return `https://openweathermap.org/img/wn/${icon}@2x.png`;
    } catch (error) {
      console.error('Error getting weather icon:', error);
      return '';
    }
  }

  public toggleHistory(): void {
    try {
      this.showHistory.set(!this.showHistory());
    } catch (error) {
      console.error('Error toggling history:', error);
    }
  }

  public clearHistory(): void {
    try {
      this.searchHistory.set([]);
      localStorage.removeItem('weatherSearchHistory'); // Clear local storage
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  public selectFromHistory(city: string): void {
    try {
      if (!city || city.trim() === '') {
        throw new Error('Invalid city selected from history.');
      }
      this.showHistory.set(false);
      console.log(`Selected city from history: ${city}`);
      // Implement additional logic for handling the selected city
    } catch (error) {
      console.error('Error selecting city from history:', error);
    }
  }

  public handleInvalidCity(): void {
    try {
      console.error(
        'Invalid city entered. Please check the city name and try again.'
      );
      alert('Invalid city entered. Please check the city name and try again.');
    } catch (error) {
      console.error('Error handling invalid city:', error);
    }
  }

  public loadWeatherSearchHistory(): void {
    try {
      const history = this.weatherSearch.searchHistory();
      this.searchHistory.set(history);
    } catch (error) {
      console.error('Error loading weather search history:', error);
    }
  }
}
