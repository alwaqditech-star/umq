import type { Prisma, Role } from "@prisma/client";
import { BaseRepository } from "./base.repository.js";

const roleWithPermissions = {
  rolePermissions: { include: { permission: true } },
} satisfies Prisma.RoleInclude;

export class RoleRepository extends BaseRepository {
  findBySlug(slug: string) {
    return this.db.role.findFirst({
      where: { slug, deletedAt: null },
      include: roleWithPermissions,
    });
  }

  findManyWithPermissions() {
    return this.db.role.findMany({
      where: { deletedAt: null },
      include: roleWithPermissions,
      orderBy: { name: "asc" },
    });
  }

  listPermissions() {
    return this.db.permission.findMany({
      where: { deletedAt: null },
      orderBy: [{ module: "asc" }, { action: "asc" }],
    });
  }

  getPermissionSlugsForRole(roleId: string): Promise<string[]> {
    return this.db.rolePermission
      .findMany({
        where: { roleId },
        include: { permission: true },
      })
      .then((rows) => rows.map((r) => r.permission.slug));
  }

  assignPermission(roleId: string, permissionId: string): Promise<Role> {
    return this.db.role.update({
      where: { id: roleId },
      data: {
        rolePermissions: {
          create: { permissionId },
        },
      },
      include: roleWithPermissions,
    });
  }
}
