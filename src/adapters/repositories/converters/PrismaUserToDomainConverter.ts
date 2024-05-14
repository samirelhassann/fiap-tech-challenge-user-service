import { UniqueEntityId } from "@/core/domain/base/entities/UniqueEntityId";
import { User } from "@/core/domain/entities/User";
import { RoleEnum } from "@/core/domain/enums/RoleEnum";
import { Password } from "@/core/domain/valueObjects/Password";
import { Role } from "@/core/domain/valueObjects/Role";
import { Taxvat } from "@/core/domain/valueObjects/Taxvat";
import { User as PrismaUser } from "@prisma/client";

export class PrismaUserToDomainConverter {
  static convert(prismaUser: PrismaUser): User {
    return new User(
      {
        name: prismaUser.name,
        email: prismaUser.email,
        taxVat: new Taxvat({ number: prismaUser.tax_vat }),
        passwordHash: new Password({ value: prismaUser.password_hash }),
        role: new Role({ name: prismaUser.role as RoleEnum }),
        createdAt: prismaUser.created_at,
        updatedAt: prismaUser.updated_at ?? undefined,
      },
      new UniqueEntityId(prismaUser.id)
    );
  }
}
