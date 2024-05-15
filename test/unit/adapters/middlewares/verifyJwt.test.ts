import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";

import verifyJwt from "@/adapters/middlewares/verifyJwt";

let req: FastifyRequest;
let res: FastifyReply;

beforeEach(() => {
  req = {
    jwtVerify: vi.fn(),
    user: {
      role: "MEMBER",
    },
  } as unknown as FastifyRequest;

  res = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply;
});

describe("verifyJwt middleware", () => {
  it("should return 401 if jwtVerify fails", async () => {
    vi.spyOn(req, "jwtVerify").mockRejectedValueOnce(new Error("Unauthorized"));

    const middleware = verifyJwt();

    await middleware(req, res);

    expect(res.code).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("should continue if jwtVerify succeeds and no roleToVerify is provided", async () => {
    vi.spyOn(req, "jwtVerify").mockResolvedValueOnce(undefined);

    const middleware = verifyJwt();

    await middleware(req, res);

    expect(res.code).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it("should return 401 if roleToVerify is provided and does not match", async () => {
    vi.spyOn(req, "jwtVerify").mockResolvedValueOnce(undefined);

    const middleware = verifyJwt("ADMIN");

    await middleware(req, res);

    expect(res.code).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("should continue if roleToVerify is provided and matches", async () => {
    vi.spyOn(req, "jwtVerify").mockResolvedValueOnce(undefined);
    req.user.role = "ADMIN";

    const middleware = verifyJwt("ADMIN");

    await middleware(req, res);

    expect(res.code).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
