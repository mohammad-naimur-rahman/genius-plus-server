import { db } from '~db'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTask = async (body: any) => {
  const userId = body.user_id
  const date = body.date

  const todoExists = await db.query.todo.findFirst({
    where: (todo, { eq }) => eq(todo.user_id, userId) && eq(todo.date, date),
    columns: {
      id: true
    }
  })

  console.log(todoExists)

  return 'sdfsd'

  //const newTask = await db.insert(task).values(req.body).returning()
}

export const taskService = {
  createTask
}
