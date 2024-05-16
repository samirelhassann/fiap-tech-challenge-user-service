import { describe, it, expect, beforeEach, vi } from "vitest";

import { PrismaUserToDomainConverter } from "@/adapters/repositories/converters/PrismaUserToDomainConverter";
import { PrismaUserRepository } from "@/adapters/repositories/PrismaUserRepository";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { User as DomainUser } from "@/core/domain/entities/User";
import { prisma } from "@/drivers/db/prisma/config/prisma";
import { User } from "@prisma/client";
import { makeUser } from "@test/unit/factories/domain/MakeUser";
import { makeRepositoryUser } from "@test/unit/factories/repository/MakeRepositoryUser";

vi.mock("@/drivers/db/prisma/config/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

let repository: PrismaUserRepository;
let user: User;

beforeEach(() => {
  repository = new PrismaUserRepository();
  user = makeRepositoryUser();
});

describe("PrismaUserRepository", () => {
  describe("findById", () => {
    it("should find user by id", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(user);

      const result = await repository.findById(user.id);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: user.id },
      });
      expect(result).toEqual(PrismaUserToDomainConverter.convert(user));
    });

    it("should return null if user not found", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

      const result = await repository.findById(user.id);

      expect(result).toBeNull();
    });
  });

  describe("findByTaxVat", () => {
    it("should find user by taxVat", async () => {
      const taxVatToSearch = user.tax_vat;
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(user);

      const result = await repository.findByTaxVat(taxVatToSearch);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { tax_vat: taxVatToSearch },
      });
      expect(result).toEqual(PrismaUserToDomainConverter.convert(user));
    });

    it("should return null if user not found", async () => {
      const taxVatToSearch = "123";
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

      const result = await repository.findByTaxVat(taxVatToSearch);

      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should find user by email", async () => {
      const emailToSearch = user.email;
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(user);

      const result = await repository.findByEmail(emailToSearch);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: emailToSearch },
      });
      expect(result).toEqual(PrismaUserToDomainConverter.convert(user));
    });

    it("should return null if user not found", async () => {
      const emailToSearch = user.email;
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

      const result = await repository.findByEmail(emailToSearch);

      expect(result).toBeNull();
    });
  });

  describe("findMany", () => {
    it("should find many users with pagination", async () => {
      const users = [user];
      const totalItems = users.length;
      const paginationParams = new PaginationParams(1, 10);

      vi.mocked(prisma.user.count).mockResolvedValueOnce(totalItems);
      vi.mocked(prisma.user.findMany).mockResolvedValueOnce(users);

      const result = await repository.findMany(paginationParams);

      expect(prisma.user.count).toHaveBeenCalled();
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(result).toEqual(
        new PaginationResponse<DomainUser>({
          data: users.map((c) => PrismaUserToDomainConverter.convert(c)),
          totalItems,
          currentPage: paginationParams.page,
          pageSize: paginationParams.size,
          totalPages: Math.ceil(totalItems / paginationParams.size),
        })
      );
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const userToCreate = makeUser();
      vi.mocked(prisma.user.create).mockResolvedValueOnce(user);

      const result = await repository.create(userToCreate);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userToCreate.name,
          email: userToCreate.email,
          tax_vat: userToCreate.taxVat.number,
          password_hash: userToCreate.passwordHash.value,
          role: userToCreate.role.name,
        },
      });
      expect(result).toEqual(PrismaUserToDomainConverter.convert(user));
    });
  });

  describe("update", () => {
    it("should update an existing user", async () => {
      const userToUpdate = makeUser();
      vi.mocked(prisma.user.update).mockResolvedValueOnce(user);

      const result = await repository.update(userToUpdate);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userToUpdate.id.toString() },
        data: {
          name: userToUpdate.name,
          email: userToUpdate.email,
        },
      });
      expect(result).toEqual(PrismaUserToDomainConverter.convert(user));
    });
  });
});
