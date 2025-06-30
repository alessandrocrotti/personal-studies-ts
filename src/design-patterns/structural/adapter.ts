// Mia nuova interfaccia
interface WeatherService {
  getTemperature(city: string): number;
}

// Classe di terze parti
class ExternalWeatherAPI {
  fetchWeatherData(location: string): { tempCelsius: number } {
    return { tempCelsius: 22 };
  }
}

// Adapter
class WeatherAdapter implements WeatherService {
  private api: ExternalWeatherAPI;

  constructor(api: ExternalWeatherAPI) {
    this.api = api;
  }

  getTemperature(city: string): number {
    const data = this.api.fetchWeatherData(city);
    return data.tempCelsius;
  }
}

// Uso
const externalAPI = new ExternalWeatherAPI();
const weatherService: WeatherService = new WeatherAdapter(externalAPI);

console.log(weatherService.getTemperature("Rome")); // Output: 22

// Rende il file un modulo ES6 invece che un file globale
export {};
