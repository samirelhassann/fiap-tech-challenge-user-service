import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { User } from "@/core/domain/entities/User";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";

export class InMemoryUserRepository implements IUserRepository {
  public items: User[] = [];

  async findById(id: string): Promise<User | null> {
    const answer = this.items.find((a) => a.id.toString() === id);

    return answer ?? null;
  }

  async findByTaxVat(taxVat: string): Promise<User | null> {
    const answer = this.items.find((a) => a.taxVat.number === taxVat);

    return answer ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const answer = this.items.find((a) => a.email === email);

    return answer ?? null;
  }

  async findMany({
    page,
    size,
  }: PaginationParams): Promise<PaginationResponse<User>> {
    const totalItems = this.items.length;
    const totalPages = Math.ceil(totalItems / size);

    const data = this.items.slice((page - 1) * size, page * size);

    return new PaginationResponse<User>({
      data,
      totalItems,
      currentPage: page,
      pageSize: size,
      totalPages,
    });
  }

  async create(user: User): Promise<User> {
    this.items.push(user);

    return user;
  }

  async update(user: User): Promise<User> {
    const index = this.items.findIndex((a) => a.id === user.id);

    this.items[index] = user;

    return user;
  }
}
