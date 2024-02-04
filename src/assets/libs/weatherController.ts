/* eslint-disable */

import axios from "axios";

export type Prediction = {
  time: number;
  temp: number;
};

export type WeatherSnapshot = {
  temp: number;
  isDay: boolean;
  weatherType: WeatherType;
  predictions: Prediction[];
};

export enum WeatherType {
  CLOUDY,
  RAINING,
  SUNNY,
  THUNDERSTORM,
  SNOW,
  CLEAR,
}

export enum Day {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

class WeatherController {
  private temperature: number;
  private location: string;
  private weekday: string;
  private time: string;

  private callback: () => void;

  private lat: number;
  private lng: number;

  private weather: WeatherSnapshot | undefined;

  private watchInterval: any = null;

  public constructor(lat: number, lng: number, callback: () => void) {
    this.temperature = 0;
    this.location = "Testort";

    this.lat = lat;
    this.lng = lng;

    this.callback = callback;

    this.time = this.fetchTime();
    this.weekday = this.fetchWeekday();

    this.update();

    this.runWatch();
  }

  public get data(): WeatherSnapshot | undefined {
    return this.weather;
  }

  public get day(): string
  {
      return this.weekday;
  }

  public async update() {
    this.weather = await this.fetchWeather(this.lat, this.lng);
  
    this.callback();
  }

  private async runWatch() {
    this.watchInterval = setInterval(async () => {
      this.time = this.fetchTime();
      this.weekday = this.fetchWeekday();
      this.update();
    }, 60000);
  }

  private fetchTime(): string {
    const tempDate: Date = new Date();

    const hours: number = tempDate.getHours();
    const minutes: number = tempDate.getMinutes();
    return `${hours}:${minutes}`;
  }

  private fetchWeekday(): string {
    const dayNumber: number = new Date().getDay();

    switch (dayNumber) {
      case Day.SUNDAY:
        return "Sonntag";
        break;
      case Day.MONDAY:
        return "Montag";
        break;
      case Day.TUESDAY:
        return "Dienstag";
        break;
      case Day.WEDNESDAY:
        return "Mittwoch";
        break;
      case Day.THURSDAY:
        return "Donnerstag";
        break;
      case Day.FRIDAY:
        return "Freitag";
        break;
      case Day.SATURDAY:
        return "Samstag";
        break;
      default:
        throw "Invalid Day Type!";
    }
  }

  private async fetchWeather(
    lat: number,
    lng: number
  ): Promise<WeatherSnapshot> {
    const currentWeather:any = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,is_day,rain,showers,snowfall,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m&forecast_days=1`
    );

    const current: WeatherSnapshot = this.parseWeatherString(JSON.stringify(currentWeather.data));

    return new Promise((resolve, reject) => {
      resolve(current);
    });
  }

  private parseWeatherString(weatherStr: string): WeatherSnapshot {
    const rawWeatherObj: any = JSON.parse(weatherStr);

    const currentTemp: number = this.getTimeTemp(
      new Date().getHours() + 1,
      rawWeatherObj
    );

    const isDay: boolean = rawWeatherObj.current.is_day;

    const currentWeatherType = this.fetchWeatherType(rawWeatherObj);

    const predictions: Prediction[] = this.getTempPrediction(rawWeatherObj);

    const snapShot: WeatherSnapshot = {
      temp: currentTemp,
      isDay: isDay,
      weatherType: currentWeatherType,
      predictions: predictions,
    };

    return snapShot;
  }

  private getTimeTemp(hour: number, weatherObj: any): number {
    const timeArr: any[] = weatherObj.hourly.time;
    const weatherArr: any[] = weatherObj.hourly.temperature_2m;
    for (let i = 0; i < timeArr.length; i++) {
      if (hour === this.getTimeFromString(timeArr[i])) {
        return parseFloat(weatherArr[i]);
      }
    }

    return -1;
  }

  private getTempPrediction(weatherObj: any): Prediction[] {
    const tempPrediction: Prediction[] = [];

    for (let i = 0; i < 24; i++) {
      const timeTemp: number = this.getTimeTemp(i, weatherObj);
      tempPrediction.push({ time: i, temp: timeTemp });
    }

    return tempPrediction;
  }

  private getTimeFromString(inputString: string): number {
    const hourRegex = new RegExp(/[0-9]+-[0-9]+-[0-9]+T([0-9]+):[0-9]+/);

    const hours: string = inputString.replace(hourRegex, "$1");

    return parseInt(hours);
  }

  private fetchWeatherType(weatherObj: any): WeatherType {
    if (weatherObj.current.rain > 0) {
      return WeatherType.RAINING;
    } else if (weatherObj.current.snowfall > 0) {
      return WeatherType.SNOW;
    } else if (weatherObj.current.cloud_cover > 20) {
      return WeatherType.CLOUDY;
    } else return WeatherType.SUNNY;
  }
}

export default WeatherController;
