/* eslint-disable consistent-return */
import { FastifyReply, FastifyRequest } from "fastify";

const identifyRequest = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    request.isAnonymous = true;
    return;
  }

  try {
    await request.jwtVerify();
    request.isAnonymous = false;
    request.userId = request.user.sub;
  } catch (e) {
    return reply.code(401).send({
      message: "Unauthorized",
    });
  }
};

export default identifyRequest;
