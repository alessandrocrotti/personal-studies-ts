// Interfaccia dell'Observer
interface Observer {
  update(temperature: number): void;
}

// Interfaccia del Subject
interface Subject {
  addObserver(observer: Observer): void;
  removeObserver(observer: Observer): void;
  notifyObservers(): void;
}

// Classe concreta del Subject
class WeatherStation implements Subject {
  private observers: Observer[] = [];
  private temperature: number = 0;

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  setTemperature(temp: number): void {
    console.log(`🌡️ Temperatura aggiornata a ${temp}°C`);
    this.temperature = temp;
    this.notifyObservers();
  }

  notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this.temperature);
    }
  }
}

// Classi concrete degli Observer
class MobileDisplay implements Observer {
  update(temperature: number): void {
    console.log(`📱 Mobile: temperatura attuale ${temperature}°C`);
  }
}

class WebDisplay implements Observer {
  update(temperature: number): void {
    console.log(`💻 Web: temperatura attuale ${temperature}°C`);
  }
}

// Uso
const station = new WeatherStation();
const mobile = new MobileDisplay();
const web = new WebDisplay();

// Aggiungo gli observer al subject
station.addObserver(mobile);
station.addObserver(web);

// Quando la temperatura cambia, gli observer vengono notificati
station.setTemperature(22);
station.setTemperature(27);

// Rende il file un modulo ES6 invece che un file globale
export {};
