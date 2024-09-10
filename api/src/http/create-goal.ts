import type { FastifyInstance } from "fastify";
import { createGoalUseCase } from "../use-cases/create-goal";
import z from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function createGoal(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post('/goals', {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7)
      })
    }
  } ,async (request, reply) => {
    const { desiredWeeklyFrequency, title } = request.body

    const result = await createGoalUseCase({title, desiredWeeklyFrequency})

    return reply.status(201).send({
      result
    })
  })
}