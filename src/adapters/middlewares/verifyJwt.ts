/* eslint-disable consistent-return */
import { FastifyReply, FastifyRequest } from "fastify";

const verifyJwt =
  (roleToVerify?: "ADMIN" | "MEMBER") =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      return reply.code(401).send({
        message: "Unauthorized",
      });
    }

    if (!roleToVerify) {
      return;
    }

    const { role } = request.user;

    if (role !== roleToVerify) {
      return reply.code(401).send({
        message: "Unauthorized",
      });
    }
  };

export default verifyJwt;
