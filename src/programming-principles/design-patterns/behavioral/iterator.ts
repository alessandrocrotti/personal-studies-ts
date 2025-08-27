// Oggetto che rappresenta una canzone
class Song {
  constructor(public title: string, public artist: string) {}
}

// Interfaccia dell'iteratore
interface Iterator<T> {
  next(): T | null;
  hasNext(): boolean;
}

// Interfaccia della collezione iterabile
interface IterableCollection<T> {
  createIterator(): Iterator<T>;
}

// Playlist: collezione concreta
class Playlist implements IterableCollection<Song> {
  private songs: Song[] = [];

  addSong(song: Song): void {
    this.songs.push(song);
  }

  createIterator(): Iterator<Song> {
    return new PlaylistIterator(this.songs);
  }
}

// Iteratore concreto
class PlaylistIterator implements Iterator<Song> {
  private position = 0;

  constructor(private songs: Song[]) {}

  next(): Song | null {
    if (this.hasNext()) {
      return this.songs[this.position++];
    }
    return null;
  }

  hasNext(): boolean {
    return this.position < this.songs.length;
  }
}

// Uso
const playlist = new Playlist();
playlist.addSong(new Song("Bohemian Rhapsody", "Queen"));
playlist.addSong(new Song("Imagine", "John Lennon"));
playlist.addSong(new Song("Billie Jean", "Michael Jackson"));

const iterator = playlist.createIterator();

console.log("🎧 Playlist:");
while (iterator.hasNext()) {
  const song = iterator.next();
  console.log(`- ${song?.title} by ${song?.artist}`);
}

// Rende il file un modulo ES6 invece che un file globale
export {};
