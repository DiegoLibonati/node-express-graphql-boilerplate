import type { AxiosInstance } from "axios";

const mockAxiosCreate: jest.Mock = jest.fn();

jest.mock("axios", () => ({
  __esModule: true,
  default: { create: mockAxiosCreate },
  create: mockAxiosCreate,
}));

describe("http_client.config", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach((): void => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  afterEach((): void => {
    process.env = originalEnv;
  });

  const loadClient = (): { httpClient: AxiosInstance } => {
    return jest.requireActual("@/configs/http_client.config");
  };

  it("should create an axios instance once at import time", () => {
    process.env.API_URL = "http://test-api";
    mockAxiosCreate.mockReturnValue({ tag: "stubbed-instance" });

    loadClient();

    expect(mockAxiosCreate).toHaveBeenCalledTimes(1);
  });

  it("should pass API_URL from envs as baseURL", () => {
    process.env.API_URL = "https://example.com";
    mockAxiosCreate.mockReturnValue({});

    loadClient();

    expect(mockAxiosCreate).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: "https://example.com" }),
    );
  });

  it("should pass HTTP_TIMEOUT_MS from envs as timeout", () => {
    process.env.API_URL = "http://test-api";
    process.env.HTTP_TIMEOUT_MS = "1234";
    mockAxiosCreate.mockReturnValue({});

    loadClient();

    expect(mockAxiosCreate).toHaveBeenCalledWith(expect.objectContaining({ timeout: 1234 }));
  });

  it("should fall back to default timeout when HTTP_TIMEOUT_MS is not set", () => {
    process.env.API_URL = "http://test-api";
    delete process.env.HTTP_TIMEOUT_MS;
    mockAxiosCreate.mockReturnValue({});

    loadClient();

    expect(mockAxiosCreate).toHaveBeenCalledWith(expect.objectContaining({ timeout: 5000 }));
  });

  it("should expose the created axios instance as httpClient", () => {
    process.env.API_URL = "http://test-api";
    mockAxiosCreate.mockReturnValue({ tag: "stubbed-instance" });

    const { httpClient } = loadClient();

    expect(httpClient).toEqual({ tag: "stubbed-instance" });
  });
});
