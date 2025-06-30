type User = {
  username: string;
  age?: number;
  email?: string;
  address?: string;
};

function userBuilder(username: string) {
  let user: User = { username };

  return {
    setAge(age: number) {
      user = { ...user, age };
      return this;
    },
    setEmail(email: string) {
      user = { ...user, email };
      return this;
    },
    setAddress(address: string) {
      user = { ...user, address };
      return this;
    },
    build() {
      return user;
    },
  };
}

const user1 = userBuilder("alice").setAge(30).setEmail("alice@example.com").build();

// OTHER VERSION

// VERSIONE CON OGGETTO IMMUTABILE
class UserProfile {
  // Tutte le proprietà sono readonly per essere immutabili
  readonly username: string;
  readonly age?: number;
  readonly email?: string;
  readonly address?: string;

  constructor(builder: UserProfileBuilder) {
    this.username = builder["username"];
    this.age = builder["age"];
    this.email = builder["email"];
    this.address = builder["address"];
  }
}

class UserProfileBuilder {
  private username: string;
  private age?: number;
  private email?: string;
  private address?: string;

  constructor(username: string) {
    this.username = username;
  }

  setAge(age: number): this {
    this.age = age;
    return this;
  }

  setEmail(email: string): this {
    this.email = email;
    return this;
  }

  setAddress(address: string): this {
    this.address = address;
    return this;
  }

  build(): UserProfile {
    return new UserProfile(this);
  }
}

const user2 = new UserProfileBuilder("alice").setAge(30).setEmail("alice@example.com").setAddress("Via Roma 1").build();

// Rende il file un modulo ES6 invece che un file globale
export {};
