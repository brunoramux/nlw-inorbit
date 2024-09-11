import type { FastifyInstance } from "fastify";
import { createGoalUseCase } from "../use-cases/create-goal";
import z from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { createGoalCompletionUseCase } from "../use-cases/create-goal-completion";

export async function createGoalCompletion(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post('/completions', {
    schema: {
      body: z.object({
        id: z.string()
      })
    }
  } ,async (request, reply) => {
    const { id: goalId } = request.body

    const result = await createGoalCompletionUseCase({ goalId })

    return reply.status(201).send({
      result
    })
  })
}