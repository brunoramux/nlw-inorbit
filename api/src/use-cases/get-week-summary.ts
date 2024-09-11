import { and, count, eq, gte, lte, sql } from "drizzle-orm"
import { db } from "../db"
import { goalCompletions, goals } from "../db/schema"
import dayjs from "dayjs"

export async function getWeekSummaryUseCase(){
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  // Retorna todas as metas cadastradas na semana atual
  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db.select({
      id: goals.id,
      title: goals.title,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      createdAt: goals.createdAt
    })
    .from(goals)
    .where(and(lte(goals.createdAt, lastDayOfWeek), gte(goals.createdAt, firstDayOfWeek)))
  )

  // Retorna metas cumpridas na semana atual
  const goalsCompletedInWeek = db.$with('goal_completion_count').as(
    db.select({
      id: goalCompletions.id,
      title: goals.title,
      completedAt: goalCompletions.createdAt,
      completedDate: sql`
        DATE(${goalCompletions.createdAt})
      `.as('completedDate')
    })
    .from(goalCompletions)
    .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
    .where(and(lte(goalCompletions.createdAt, lastDayOfWeek), gte(goalCompletions.createdAt, firstDayOfWeek)))
  )

  const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
    db.select({
      completedAtDate: goalsCompletedInWeek.completedDate,
      completions: sql`
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ${goalsCompletedInWeek.id},
            'title', ${goalsCompletedInWeek.title},
            'completedAt', ${goalsCompletedInWeek.completedAt}
          )
        )
      `.as('completions')
    })
    .from(goalsCompletedInWeek)
    .groupBy(goalsCompletedInWeek.completedDate)
  )

  const result = await db.with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
  .select({
    completed: sql `
      (SELECT COUNT(*) FROM ${goalsCompletedInWeek})
    `.mapWith(Number),
    total: sql `
      (SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})
    `.mapWith(Number),
    goalsPerDay: sql `
      JSON_OBJECT_AGG(
        ${goalsCompletedByWeekDay.completedAtDate},
        ${goalsCompletedByWeekDay.completions}
      )
    `
  })
  .from(goalsCompletedByWeekDay)

  return {
    summary: result
  }
}