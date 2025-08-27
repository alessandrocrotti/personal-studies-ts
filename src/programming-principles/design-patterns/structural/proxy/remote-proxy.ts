// Interfaccia della classe
interface UserService {
  getUser(id: number): Promise<string>;
}

// Oggetto remoto simulato
class RemoteUserService implements UserService {
  async getUser(id: number): Promise<string> {
    // Simulazione di una chiamata HTTP
    console.log(`Fetching user ${id} from remote server...`);
    await new Promise((res) => setTimeout(res, 1000)); // Simula latenza
    return `User_${id}`;
  }
}

// Remote proxy che incapsula la logica di chiamata remota
class UserServiceProxy implements UserService {
  private realService: RemoteUserService;

  constructor() {
    this.realService = new RemoteUserService();
  }

  async getUser(id: number): Promise<string> {
    console.log("Proxy: delego la richiesta al servizio remoto.");
    return this.realService.getUser(id);
  }
}

// Uso
const userService: UserService = new UserServiceProxy();

userService.getUser(42).then((name) => console.log(`Nome utente: ${name}`));

// Rende il file un modulo ES6 invece che un file globale
export {};
