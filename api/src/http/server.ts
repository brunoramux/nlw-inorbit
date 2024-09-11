import fastify from 'fastify'
import { env } from '../env'
import { createGoal } from './create-goal'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { getWeekPendingGoals } from './get-week-pending-goals'


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createGoal)
app.register(getWeekPendingGoals)

app.listen({
  port: env.PORT
}).then(() => {
  console.log("HTTP server running")
})

