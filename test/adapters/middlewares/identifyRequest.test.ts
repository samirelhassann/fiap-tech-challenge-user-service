import { FastifyRequest, FastifyReply } from "fastify";
import { describe, it, expect, vi } from "vitest";

import identifyRequest from "@/adapters/middlewares/identifyRequest";

describe("identifyRequest middleware", () => {
  it("should set request.isAnonymous to true if no authorization header", async () => {
    const request = {
      headers: {},
    } as FastifyRequest;

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await identifyRequest(request, reply);

    expect(request.isAnonymous).toBe(true);
  });

  it("should set request.isAnonymous to false and set userId if jwtVerify succeeds", async () => {
    const user = { sub: "123" };
    const request = {
      headers: { authorization: "Bearer token" },
      jwtVerify: vi.fn().mockResolvedValueOnce(undefined),
      user,
    } as unknown as FastifyRequest;

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await identifyRequest(request, reply);

    expect(request.isAnonymous).toBe(false);
    expect(request.userId).toBe(user.sub);
  });

  it("should return 401 and send Unauthorized if jwtVerify fails", async () => {
    const request = {
      headers: { authorization: "Bearer token" },
      jwtVerify: vi.fn().mockRejectedValueOnce(new Error("Unauthorized")),
    } as unknown as FastifyRequest;

    const reply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await identifyRequest(request, reply);

    expect(reply.code).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Unauthorized",
    });
  });
});
