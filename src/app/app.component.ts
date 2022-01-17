import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment as env} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  baseUrl: string = 'https://api.openweathermap.org/data/2.5/weather?q=';
  weatherData = false;
  search: string = '';
  name?: string;
  icon?: string;
  description?: string;
  temp?: number;
  humidity?: number;
  speed?: number;
  iconUrl?: string;
  weatherSub?: Subscription;
  errorMessage?: string;
  loading = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.weatherData = false;
  }

  getWeatherByCity(city: string){
    this.errorMessage = '';
    this.loading = true;
    this.weatherSub = this.http.get(`${this.baseUrl}${city}&appid=${env.API_KEY}&units=metric&lang=de`)
      .subscribe((response) => {
        this.loading = false;
        this.displayWeather(response);
        this.weatherData = true;
      }, (error) => {
        this.weatherData = false;
        this.loading = false;
        this.displayError(error.error.message);
      })
  }

  displayWeather(response: any) {
    this.name = response.name;
    this.icon = response.weather[0].icon;
    this.description = response.weather[0].description;
    this.temp = response.main.temp;
    this.humidity = response.main.humidity;
    this.speed = response.wind.speed;
    this.iconUrl = `https://openweathermap.org/img/wn/${this.icon}@2x.png`;
    this.search = '';
  }

  displayError(errorMessage: string) {
    if(errorMessage === 'city not found') {
      this.errorMessage = 'Stadt nicht gefunden. Bitte erneut versuchen.';
    } else {
      this.errorMessage = `Es ist ein Fehler aufgetreten. Bitte später erneut versuchen. Error: ${errorMessage}`;
    }
  }

  ngOnDestroy() {
    this.weatherSub?.unsubscribe();
  }

}
