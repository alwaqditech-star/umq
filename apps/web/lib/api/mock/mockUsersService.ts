import type { UsersService } from "../interfaces/users.service";
import { createMockCrud } from "./create-mock-crud";
import { mockRoles, mockUsers } from "@/mocks/users";
import { delay } from "@/lib/utils";

const usersCrud = createMockCrud(mockUsers);

export const mockUsersService: UsersService = {
  getAll: () => usersCrud.getAll(),
  getById: (id) => usersCrud.getById(id),
  create: (data) => usersCrud.create(data),
  update: (id, data) => usersCrud.update(id, data),
  delete: (id) => usersCrud.delete(id),
  async getRoles() {
    await delay(100);
    return [...mockRoles];
  },
  async getRoleById(id: string) {
    await delay(100);
    return mockRoles.find((r) => r.id === id) ?? null;
  },
};
