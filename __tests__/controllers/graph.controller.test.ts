import type { NextFunction, Request, Response } from "express";

interface GraphControllerType {
  handler: (req: Request, res: Response, next: NextFunction) => void;
  graphiql: (req: Request, res: Response, next: NextFunction) => void;
}

const mockCreateHandler: jest.Mock = jest.fn();
const mockRuruHTML: jest.Mock = jest.fn();

jest.mock("graphql-http/lib/use/express", () => ({
  createHandler: mockCreateHandler,
}));

jest.mock("ruru/server", () => ({
  ruruHTML: mockRuruHTML,
}));

const loadController = (): GraphControllerType => {
  const mod: { GraphController: GraphControllerType } = jest.requireActual(
    "@/controllers/graph.controller",
  );
  return mod.GraphController;
};

const buildMockReq = (): Request => ({}) as Request;

const buildMockRes = (): Response => {
  const res: Partial<Response> = {};
  res.setHeader = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("graph.controller", () => {
  let mockInnerHandler: jest.Mock;

  beforeEach((): void => {
    jest.resetModules();
    mockInnerHandler = jest.fn();
    mockCreateHandler.mockReturnValue(mockInnerHandler);
  });

  describe("handler", () => {
    it("should build the GraphQL handler with the configured schema at module load", () => {
      loadController();

      expect(mockCreateHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          schema: expect.any(Object),
          validationRules: expect.any(Array),
        }),
      );
    });

    it("should build the GraphQL handler exactly once per module load", () => {
      loadController();

      expect(mockCreateHandler).toHaveBeenCalledTimes(1);
    });

    it("should delegate the request to the configured GraphQL handler", () => {
      const GraphController = loadController();
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      GraphController.handler(mockReq, mockRes, mockNext);

      expect(mockInnerHandler).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockInnerHandler).toHaveBeenCalledTimes(1);
    });

    it("should not invoke createHandler again on each request", () => {
      const GraphController = loadController();
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      GraphController.handler(mockReq, mockRes, mockNext);
      GraphController.handler(mockReq, mockRes, mockNext);
      GraphController.handler(mockReq, mockRes, mockNext);

      expect(mockCreateHandler).toHaveBeenCalledTimes(1);
      expect(mockInnerHandler).toHaveBeenCalledTimes(3);
    });
  });

  describe("graphiql", () => {
    it("should set the Content-Type header to text/html", () => {
      const GraphController = loadController();
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();
      mockRuruHTML.mockReturnValue("<html />");

      GraphController.graphiql(mockReq, mockRes, mockNext);

      expect(mockRes.setHeader).toHaveBeenCalledWith("Content-Type", "text/html");
    });

    it("should override the Content-Security-Policy header to allow ruru assets from unpkg.com", () => {
      const GraphController = loadController();
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();
      mockRuruHTML.mockReturnValue("<html />");

      GraphController.graphiql(mockReq, mockRes, mockNext);

      const cspCall = (mockRes.setHeader as jest.Mock).mock.calls.find(
        (args: unknown[]) => args[0] === "Content-Security-Policy",
      );
      expect(cspCall).toBeDefined();
      const cspValue: string = cspCall?.[1] as string;
      expect(cspValue).toContain("script-src 'self' 'unsafe-inline' https://unpkg.com");
      expect(cspValue).toContain("connect-src 'self' https://unpkg.com");
      expect(cspValue).toContain("style-src 'self' 'unsafe-inline' https://unpkg.com");
    });

    it("should send the ruru HTML pointing to /api/v1/graphql", () => {
      const GraphController = loadController();
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();
      mockRuruHTML.mockReturnValue("<html>graphiql</html>");

      GraphController.graphiql(mockReq, mockRes, mockNext);

      expect(mockRuruHTML).toHaveBeenCalledWith({ endpoint: "/api/v1/graphql" });
      expect(mockRes.send).toHaveBeenCalledWith("<html>graphiql</html>");
    });

    it("should not call next on the happy path", () => {
      const GraphController = loadController();
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();
      mockRuruHTML.mockReturnValue("<html />");

      GraphController.graphiql(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should forward the error to next when ruruHTML throws", () => {
      const GraphController = loadController();
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();
      const boom: Error = new Error("boom");
      mockRuruHTML.mockImplementation((): never => {
        throw boom;
      });

      GraphController.graphiql(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(boom);
    });

    it("should forward the error to next when res.send throws", () => {
      const GraphController = loadController();
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();
      mockRuruHTML.mockReturnValue("<html />");
      const boom: Error = new Error("boom");
      (mockRes.send as jest.Mock).mockImplementation((): never => {
        throw boom;
      });

      GraphController.graphiql(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(boom);
    });
  });
});
