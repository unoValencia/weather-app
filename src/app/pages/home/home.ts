import { Component, inject, signal, resource, ResourceRef, viewChild } from '@angular/core';
import { Weather } from '../../services/weather/weather';
import { IWeather } from '../../models/weather.model';
import { SampleCard } from '../../components/sample-card/sample-card';
import { WeatherSearch } from '../../components/weather-search/weather-search';

@Component({
  selector: 'app-home',
  imports: [
    SampleCard,
    WeatherSearch,

  ],
  templateUrl: './home.html'
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
          country: data.sys.country,
          coordinates: `Lat: ${data.coord.lat}, Lon: ${data.coord.lon}`,
          temperature: data.main.temp,
          feelsLike: data.main.feels_like,
          tempMin: data.main.temp_min,
          tempMax: data.main.temp_max,
          pressure: data.main.pressure,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          windDegree: data.wind.deg,
          visibility: data.visibility,
          cloudiness: data.clouds?.all || 0,
          weatherMain: data.weather[0].main,
          weatherDescription: data.weather[0].description,
          weatherIcon: data.weather[0].icon,
          sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
          sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
          timezone: data.timezone,
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