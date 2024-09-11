import type { FastifyInstance } from "fastify";
import { createGoalUseCase } from "../use-cases/create-goal";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { getWeekPendingGoalsUseCase } from "../use-cases/get-week-pending-goals";

export async function getWeekPendingGoals(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().get('/pending-goals',async (request, reply) => {

    const result = await getWeekPendingGoalsUseCase()

    return reply.status(200).send({
      result
    })
  })
}