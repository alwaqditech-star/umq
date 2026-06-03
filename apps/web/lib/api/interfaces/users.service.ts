import type { CrudService, Role, User } from "../types";

export interface UsersService extends CrudService<User> {
  getRoles(): Promise<Role[]>;
  getRoleById(id: string): Promise<Role | null>;
}
