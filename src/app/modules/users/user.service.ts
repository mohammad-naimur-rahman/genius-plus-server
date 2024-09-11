import { db } from '~db'

const getAllUsers = async () => {
  const allUsers = await db.query.user.findMany()
  return allUsers
}

export const userService = {
  getAllUsers
}
