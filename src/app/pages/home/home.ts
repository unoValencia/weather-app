import { Component, inject, signal, resource, ResourceRef, viewChild } from '@angular/core';
import { Weather } from '../../services/weather/weather';
import { IWeather } from '../../models/weather.model';
import { SampleCard } from '../../components/sample-card/sample-card';
import { WeatherSearch } from '../../components/weather-search/weather-search';
import { ApplicationConfig } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [
    SampleCard,
    WeatherSearch,

  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  private readonly weatherService = inject(Weather);
  

  public readonly cityName = signal<string>('');
  public readonly unitSystem = signal<'metric' | 'imperial'>('metric');

  public readonly weatherDataResource: ResourceRef<IWeather | undefined> = resource({
    loader: async () => {
      try {
        const city = this.cityName();
        const units = this.unitSystem();

        if (!city) {
          return undefined;
        }

        const data = await this.weatherService.getWeather(city);

        console.log('Full Weather Data:', data);
        const tableData = {
          city: data.name,
          temperature: data.main.temp,
          humidity: data.main.humidity,
        };
        console.table(tableData);

        return data;
      } catch (error: any) {
        throw error;
      }
    }
  });

  public onSearchCity(event: { city: string; units: 'metric' | 'imperial' }): void {
    this.cityName.set(event.city);
    this.unitSystem.set(event.units);
    this.weatherDataResource.reload();
  }

  public toggleUnitSystem(): void {
    const newUnit = this.unitSystem() === 'metric' ? 'imperial' : 'metric';
    this.unitSystem.set(newUnit);

    if (this.cityName()) {
      this.weatherDataResource.reload();
    }
  }


}