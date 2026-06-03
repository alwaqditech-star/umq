import { createMockCrud } from "./create-mock-crud";
import { mockProjects } from "@/mocks/projects";

export const mockProjectsService = createMockCrud(mockProjects);
