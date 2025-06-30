// Interfaccia classi basso livello
interface Device {
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
  setVolume(percent: number): void;
  getVolume(): number;
}

// Classi di basso livello che racchiudono la logica
class TV implements Device {
  private on = false;
  private volume = 50;

  isEnabled(): boolean {
    return this.on;
  }

  enable(): void {
    this.on = true;
    console.log("TV accesa");
  }

  disable(): void {
    this.on = false;
    console.log("TV spenta");
  }

  setVolume(percent: number): void {
    this.volume = percent;
    console.log(`Volume TV: ${this.volume}`);
  }

  getVolume(): number {
    return this.volume;
  }
}

class Radio implements Device {
  private on = false;
  private volume = 30;

  isEnabled(): boolean {
    return this.on;
  }

  enable(): void {
    this.on = true;
    console.log("Radio accesa");
  }

  disable(): void {
    this.on = false;
    console.log("Radio spenta");
  }

  setVolume(percent: number): void {
    this.volume = percent;
    console.log(`Volume Radio: ${this.volume}`);
  }

  getVolume(): number {
    return this.volume;
  }
}

// Astrazione che incapsula la logica di alto livello
class RemoteControl {
  constructor(protected device: Device) {}

  togglePower(): void {
    if (this.device.isEnabled()) {
      this.device.disable();
    } else {
      this.device.enable();
    }
  }

  volumeDown(): void {
    const current = this.device.getVolume();
    this.device.setVolume(current - 10);
  }

  volumeUp(): void {
    const current = this.device.getVolume();
    this.device.setVolume(current + 10);
  }
}

// Astrazione che estende la logica di alto livello
class AdvancedRemoteControl extends RemoteControl {
  mute(): void {
    this.device.setVolume(0);
    console.log("Dispositivo messo in muto");
  }
}

// Uso
const tv = new TV();
const radio = new Radio();

// usando l'atrazione del remote control, passandogli il device, non devo specificare classi di remote control per ogni device
const remote = new RemoteControl(tv);
remote.togglePower(); // Accende la TV
remote.volumeUp();

// utilizzo dell'astrazione con un altro device
const advancedRemote = new AdvancedRemoteControl(radio);
advancedRemote.togglePower(); // Accende la radio
advancedRemote.mute(); // Mette in muto

// Rende il file un modulo ES6 invece che un file globale
export {};
