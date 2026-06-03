import { createMockCrud } from "./create-mock-crud";
import { mockBlogPosts } from "@/mocks/blog";

export const mockBlogService = createMockCrud(mockBlogPosts);
