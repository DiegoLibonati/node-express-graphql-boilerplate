import type { User } from "@/types/app";
import type { CreateUserArgs } from "@/types/args";
import type { CreateUserInput } from "@/types/inputs";

import { httpClient } from "@/configs/http_client.config";

import { MutationResolver } from "@/resolvers/mutation.resolver";

import { mockUser } from "@tests/__mocks__/users.mock";

const mockHttp = httpClient as jest.Mocked<typeof httpClient>;

jest.mock("@/configs/http_client.config", () => ({
  httpClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("mutation.resolver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should call the API and return the created user", async () => {
      const input: CreateUserInput = {
        name: "Leanne Graham",
        username: "Bret",
        email: "sincere@april.biz",
      };
      const args: CreateUserArgs = { input };
      mockHttp.post.mockResolvedValue({ data: mockUser });

      const result: User = await MutationResolver.createUser(null, args);

      expect(result).toEqual(mockUser);
      expect(mockHttp.post).toHaveBeenCalledWith("/users", input);
      expect(mockHttp.post).toHaveBeenCalledTimes(1);
    });

    it("should post to the correct endpoint", async () => {
      const input: CreateUserInput = {
        name: "Ana",
        username: "ana99",
        email: "ana@x.com",
        phone: "555-1234",
        website: "ana.dev",
      };
      const args: CreateUserArgs = { input };
      mockHttp.post.mockResolvedValue({ data: mockUser });

      await MutationResolver.createUser(null, args);

      expect(mockHttp.post).toHaveBeenCalledWith("/users", input);
    });

    it("should propagate the error when the API call fails", async () => {
      const input: CreateUserInput = {
        name: "Ana",
        username: "ana99",
        email: "ana@x.com",
      };
      const args: CreateUserArgs = { input };
      mockHttp.post.mockRejectedValue(new Error("Server error"));

      await expect(MutationResolver.createUser(null, args)).rejects.toThrow("Server error");
    });
  });
});
