import { asc, desc } from 'drizzle-orm'

export const getOffset = (page: number = 1, limit: number = 10) =>
  (page - 1) * limit

export const getSortOrder = (sortOrder: 'asc' | 'desc') => {
  switch (sortOrder) {
    case 'asc':
      return asc
    case 'desc':
      return desc
    default:
      return asc
  }
}

export const paginateQueries = (...args: string[]) => {
  const defultQueries = ['sortBy', 'sortOrder', 'page', 'limit', 'search']
  return [...args, ...defultQueries]
}
