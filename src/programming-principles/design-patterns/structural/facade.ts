// Subsystems
class Projector {
  on() {
    console.log("Projector on");
  }
  off() {
    console.log("Projector off");
  }
}

class Amplifier {
  on() {
    console.log("Amplifier on");
  }
  setVolume(level: number) {
    console.log(`Volume set to ${level}`);
  }
  off() {
    console.log("Amplifier off");
  }
}

class BluRayPlayer {
  on() {
    console.log("BluRay Player on");
  }
  play(movie: string) {
    console.log(`Playing movie: ${movie}`);
  }
  off() {
    console.log("BluRay Player off");
  }
}

class Lights {
  dim() {
    console.log("Lights dimmed");
  }
  on() {
    console.log("Lights on");
  }
}

// Facade
class HomeTheaterFacade {
  constructor(private projector: Projector, private amp: Amplifier, private player: BluRayPlayer, private lights: Lights) {}
  // Metodo che semplifica l'utilizzo dei sottosistemi
  watchMovie(movie: string): void {
    console.log("Get ready to watch a movie...");
    this.lights.dim();
    this.projector.on();
    this.amp.on();
    this.amp.setVolume(5);
    this.player.on();
    this.player.play(movie);
  }
  // Metodo che semplifica l'utilizzo dei sottosistemi
  endMovie(): void {
    console.log("Shutting movie theater down...");
    this.player.off();
    this.amp.off();
    this.projector.off();
    this.lights.on();
  }
}

// Uso
const facade = new HomeTheaterFacade(new Projector(), new Amplifier(), new BluRayPlayer(), new Lights());

facade.watchMovie("Inception");
facade.endMovie();

// Rende il file un modulo ES6 invece che un file globale
export {};
