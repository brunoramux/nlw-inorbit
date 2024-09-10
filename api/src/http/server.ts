import fastify from 'fastify'
import { env } from '../env'
import { createGoal } from './create-goal'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createGoal)

app.listen({
  port: env.PORT
}).then(() => {
  console.log("HTTP server running")
})

