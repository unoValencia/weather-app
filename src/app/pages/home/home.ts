import { Component, inject, OnInit, resource } from '@angular/core';
import { Weather } from '../../services/weather/weather';
import { SampleCard } from '../../components/sample-card/sample-card';

@Component({
  selector: 'app-home',
  imports: [
    SampleCard
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  private readonly weatherService = inject(Weather);

  //signals
  public readonly weatherDataResource = resource({
    loader: () => this.weatherService.getWeather('Makati')
  });

}
