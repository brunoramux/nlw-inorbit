import fastify from 'fastify'
import { env } from '../env'
import { createGoal } from './create-goal'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { getWeekPendingGoals } from './get-week-pending-goals'
import { getWeekSummary } from './get-week-summary'
import fastifyCors from '@fastify/cors'


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createGoal)
app.register(getWeekPendingGoals)
app.register(getWeekSummary)

app.listen({
  port: env.PORT
}).then(() => {
  console.log("HTTP server running")
})

