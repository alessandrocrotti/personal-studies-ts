// Interfaccia del Mediator
interface ChatMediator {
  sendMessage(message: string, sender: ChatUser): void;
}

// Classe concreta del Mediator
class ChatRoom implements ChatMediator {
  private users: ChatUser[] = [];

  addUser(user: ChatUser): void {
    this.users.push(user);
  }

  sendMessage(message: string, sender: ChatUser): void {
    for (const user of this.users) {
      if (user !== sender) {
        user.receive(message, sender.name);
      }
    }
  }
}

// Classe Colleague
class ChatUser {
  constructor(public name: string, private mediator: ChatMediator) {}

  send(message: string): void {
    console.log(`${this.name} invia: "${message}"`);
    this.mediator.sendMessage(message, this);
  }

  receive(message: string, senderName: string): void {
    console.log(`${this.name} riceve da ${senderName}: "${message}"`);
  }
}

// Uso

// Unica istanza del mediator che verrà condivisa tra tutti gli oggetti che interagiscono tra di loro
const chatRoom = new ChatRoom();

const alice = new ChatUser("Alice", chatRoom);
const bob = new ChatUser("Bob", chatRoom);
const carol = new ChatUser("Carol", chatRoom);

chatRoom.addUser(alice);
chatRoom.addUser(bob);
chatRoom.addUser(carol);

alice.send("Ciao a tutti!");
bob.send("Ehi Alice!");

// Rende il file un modulo ES6 invece che un file globale
export {};
