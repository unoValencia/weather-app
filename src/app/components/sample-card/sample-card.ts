import { Component, input } from '@angular/core';
import { IWeather } from '../../models/weather.model';

@Component({
  selector: 'app-sample-card',
  imports: [],
  templateUrl: './sample-card.html',
  styleUrl: './sample-card.css'
})
export class SampleCard {

  readonly weatherData = input<IWeather>();

}