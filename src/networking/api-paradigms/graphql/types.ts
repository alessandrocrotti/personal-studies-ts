export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
}

export interface CreateUserInput {
  name: string;
  age?: number;
  role: Role;
}

export interface User {
  id: string;
  name: string;
  age?: number;
  role: Role;
  profile?: Profile;
  posts?: Post[];
}

export interface Profile {
  userId?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
}
