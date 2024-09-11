import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { getWeekSummaryUseCase } from "../use-cases/get-week-summary"

export async function getWeekSummary(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().get('/week-summary',async (request, reply) => {

    const result = await getWeekSummaryUseCase()

    return reply.status(200).send({
      result
    })
  })
}