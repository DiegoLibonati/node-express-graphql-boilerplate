import axios from "axios";

import type { User } from "@/types/app";
import type { CreateUserArgs } from "@/types/args";
import type { CreateUserInput } from "@/types/inputs";

import { MutationResolver } from "@/resolvers/mutation.resolver";

import { mockUser } from "@tests/__mocks__/users.mock";

const mockAxios = axios as jest.Mocked<typeof axios>;

jest.mock("axios");
jest.mock("@/configs/env.config", () => ({
  envs: { API_URL: "http://test-api" },
}));

describe("mutation.resolver", () => {
  describe("createUser", () => {
    it("should call the API and return the created user", async () => {
      const input: CreateUserInput = {
        name: "Leanne Graham",
        username: "Bret",
        email: "sincere@april.biz",
      };
      const args: CreateUserArgs = { input };
      mockAxios.post.mockResolvedValue({ data: mockUser });

      const result: User = await MutationResolver.createUser(null, args);

      expect(result).toEqual(mockUser);
      expect(mockAxios.post).toHaveBeenCalledWith("http://test-api/users", input);
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
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
      mockAxios.post.mockResolvedValue({ data: mockUser });

      await MutationResolver.createUser(null, args);

      expect(mockAxios.post).toHaveBeenCalledWith("http://test-api/users", input);
    });

    it("should propagate the error when the API call fails", async () => {
      const input: CreateUserInput = {
        name: "Ana",
        username: "ana99",
        email: "ana@x.com",
      };
      const args: CreateUserArgs = { input };
      mockAxios.post.mockRejectedValue(new Error("Server error"));

      await expect(MutationResolver.createUser(null, args)).rejects.toThrow("Server error");
    });
  });
});
