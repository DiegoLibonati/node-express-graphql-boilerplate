import axios from "axios";

import type { User } from "@/types/app";
import type { UserArgs } from "@/types/args";

import { QueryResolver } from "@/resolvers/query.resolver";

import { mockUser, mockUsers } from "@tests/__mocks__/users.mock";

const mockAxios = axios as jest.Mocked<typeof axios>;

jest.mock("axios");
jest.mock("@/configs/env.config", () => ({
  envs: { API_URL: "http://test-api" },
}));

describe("query.resolver", () => {
  describe("users", () => {
    it("should return the list of users from the API", async () => {
      const expectedUsers: User[] = mockUsers;
      mockAxios.get.mockResolvedValue({ data: expectedUsers });

      const result: User[] = await QueryResolver.users();

      expect(result).toEqual(expectedUsers);
      expect(mockAxios.get).toHaveBeenCalledWith("http://test-api/users");
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when the API returns no users", async () => {
      mockAxios.get.mockResolvedValue({ data: [] });

      const result: User[] = await QueryResolver.users();

      expect(result).toEqual([]);
    });

    it("should propagate the error when the API call fails", async () => {
      mockAxios.get.mockRejectedValue(new Error("Network error"));

      await expect(QueryResolver.users()).rejects.toThrow("Network error");
    });
  });

  describe("user", () => {
    it("should return the user with the given id from the API", async () => {
      mockAxios.get.mockResolvedValue({ data: mockUser });
      const args: UserArgs = { id: 1 };

      const result: User = await QueryResolver.user(null, args);

      expect(result).toEqual(mockUser);
      expect(mockAxios.get).toHaveBeenCalledWith("http://test-api/users/1");
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });

    it("should build the URL with the correct id", async () => {
      mockAxios.get.mockResolvedValue({ data: mockUser });
      const args: UserArgs = { id: 42 };

      await QueryResolver.user(null, args);

      expect(mockAxios.get).toHaveBeenCalledWith("http://test-api/users/42");
    });

    it("should propagate the error when the API returns an error", async () => {
      mockAxios.get.mockRejectedValue(new Error("Not found"));
      const args: UserArgs = { id: 99 };

      await expect(QueryResolver.user(null, args)).rejects.toThrow("Not found");
    });
  });
});
