import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    isAnonymous?: boolean;
    userId?: string;
  }
}
