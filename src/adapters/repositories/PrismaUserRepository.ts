import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { User } from "@/core/domain/entities/User";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { prisma } from "@/drivers/db/prisma/config/prisma";

import { PrismaUserToDomainConverter } from "./converters/PrismaUserToDomainConverter";

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user
      .findUnique({
        where: {
          id,
        },
      })
      .then((user) =>
        user ? PrismaUserToDomainConverter.convert(user) : null
      );
  }

  async findByTaxVat(taxVat: string): Promise<User | null> {
    return prisma.user
      .findUnique({
        where: {
          tax_vat: taxVat,
        },
      })
      .then((user) =>
        user ? PrismaUserToDomainConverter.convert(user) : null
      );
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user
      .findUnique({
        where: {
          email,
        },
      })
      .then((user) =>
        user ? PrismaUserToDomainConverter.convert(user) : null
      );
  }

  async findMany({
    page,
    size,
  }: PaginationParams): Promise<PaginationResponse<User>> {
    const totalItems = await prisma.user.count();
    const totalPages = Math.ceil(totalItems / size);

    const data = await prisma.user.findMany({
      skip: (page - 1) * size,
      take: size,
    });

    return new PaginationResponse<User>({
      data: data.map((c) => PrismaUserToDomainConverter.convert(c)),
      totalItems,
      currentPage: page,
      pageSize: size,
      totalPages,
    });
  }

  async create(user: User): Promise<User> {
    return prisma.user
      .create({
        data: {
          name: user.name,
          email: user.email,
          tax_vat: user.taxVat.number,
          password_hash: user.passwordHash?.value,
          role: user.role.name,
        },
      })
      .then((c) => PrismaUserToDomainConverter.convert(c));
  }

  async update(user: User): Promise<User> {
    return prisma.user
      .update({
        where: {
          id: user.id.toString(),
        },
        data: {
          name: user.name,
          email: user.email,
        },
      })
      .then((c) => PrismaUserToDomainConverter.convert(c));
  }
}
