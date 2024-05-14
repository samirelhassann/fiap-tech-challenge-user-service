import { PrismaUserRepository } from "./PrismaUserRepository";

let userRepositoryInstance: PrismaUserRepository;

export function makeUserRepository() {
  if (!userRepositoryInstance) {
    userRepositoryInstance = new PrismaUserRepository();
  }
  return userRepositoryInstance;
}
