import type { User } from "@/types/app";
import type { UserArgs } from "@/types/args";

import { httpClient } from "@/configs/http_client.config";

import { QueryResolver } from "@/resolvers/query.resolver";

import { mockUser, mockUsers } from "@tests/__mocks__/users.mock";

const mockHttp = httpClient as jest.Mocked<typeof httpClient>;

jest.mock("@/configs/http_client.config", () => ({
  httpClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("query.resolver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("users", () => {
    it("should return the list of users from the API", async () => {
      const expectedUsers: User[] = mockUsers;
      mockHttp.get.mockResolvedValue({ data: expectedUsers });

      const result: User[] = await QueryResolver.users();

      expect(result).toEqual(expectedUsers);
      expect(mockHttp.get).toHaveBeenCalledWith("/users");
      expect(mockHttp.get).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when the API returns no users", async () => {
      mockHttp.get.mockResolvedValue({ data: [] });

      const result: User[] = await QueryResolver.users();

      expect(result).toEqual([]);
    });

    it("should propagate the error when the API call fails", async () => {
      mockHttp.get.mockRejectedValue(new Error("Network error"));

      await expect(QueryResolver.users()).rejects.toThrow("Network error");
    });
  });

  describe("user", () => {
    it("should return the user with the given id from the API", async () => {
      mockHttp.get.mockResolvedValue({ data: mockUser });
      const args: UserArgs = { id: 1 };

      const result: User = await QueryResolver.user(null, args);

      expect(result).toEqual(mockUser);
      expect(mockHttp.get).toHaveBeenCalledWith("/users/1");
      expect(mockHttp.get).toHaveBeenCalledTimes(1);
    });

    it("should build the URL with the correct id", async () => {
      mockHttp.get.mockResolvedValue({ data: mockUser });
      const args: UserArgs = { id: 42 };

      await QueryResolver.user(null, args);

      expect(mockHttp.get).toHaveBeenCalledWith("/users/42");
    });

    it("should propagate the error when the API returns an error", async () => {
      mockHttp.get.mockRejectedValue(new Error("Not found"));
      const args: UserArgs = { id: 99 };

      await expect(QueryResolver.user(null, args)).rejects.toThrow("Not found");
    });
  });
});
