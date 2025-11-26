import { Component, input, signal } from '@angular/core';
import { IWeather } from '../../models/weather.model';

@Component({
  selector: 'app-sample-card',
  imports: [],
  templateUrl: './sample-card.html',
  styleUrl: './sample-card.css'
})
export class SampleCard {
  readonly weatherData = input<IWeather>();
  readonly isMetric = signal(true);

  setMetric(value: boolean): void {
    this.isMetric.set(value);
  }

  getTemperature(): string {
    const temp = this.weatherData()?.main?.temp;
    if (temp === undefined || temp === null) return '--';

    if (this.isMetric()) {
      // Convert Kelvin to Celsius
      const celsius = temp - 273.15;
      return celsius.toFixed(1);
    } else {
      // Convert Kelvin to Fahrenheit
      const fahrenheit = (temp - 273.15) * 9/5 + 32;
      return fahrenheit.toFixed(1);
    }
  }

  getWindSpeed(): string {
    const speed = this.weatherData()?.wind?.speed;
    if (speed === undefined || speed === null) return '--';
    
    if (this.isMetric()) {
      return speed.toFixed(1);
    } else {
      // Convert km/h to mph
      const mph = speed * 0.621371;
      return mph.toFixed(1);
    }
  }
}