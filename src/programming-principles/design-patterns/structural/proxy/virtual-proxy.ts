// Interfaccia della classe
interface Image {
  display(): void;
}

// Classe reale che implementa l'interfaccia
class RealImage implements Image {
  // Costruttore che carica l'immagine dal disco
  constructor(private filename: string) {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    console.log(`Loading ${this.filename} from disk...`);
  }

  display(): void {
    console.log(`Displaying ${this.filename}`);
  }
}

// Classe proxy che implementa l'interfaccia e gestiste la classe reale
class ProxyImage implements Image {
  private realImage: RealImage | null = null;
  // Costruttore che crea l'oggetto proxy senza caricare l'immagine
  constructor(private filename: string) {}

  // Metodo che carica l'immagine se non è già caricata
  display(): void {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename); // Lazy loading
    }
    this.realImage.display();
  }
}

const image = new ProxyImage("photo.jpg");

console.log("Image created, but not loaded yet.");
image.display(); // Carica e mostra
image.display(); // Mostra senza ricaricare

// Rende il file un modulo ES6 invece che un file globale
export {};
