import { db } from "../db"
import { goals } from "../db/schema"

interface createGoalRequest {
  title: string
  desiredWeeklyFrequency: number
}

export async function createGoalUseCase({desiredWeeklyFrequency, title}: createGoalRequest){
  const result = await db.insert(goals).values({
    title,
    desiredWeeklyFrequency
  }).returning()

  const goal = result[0]

  return {
    goal
  }
}