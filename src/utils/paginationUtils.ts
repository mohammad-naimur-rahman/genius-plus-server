import { AnyColumn, asc, count, desc, SQL } from 'drizzle-orm'
import { AnyPgTable } from 'drizzle-orm/pg-core'
import { db } from '~db'
import pick from '~shared/pick'
import { DBQuery, PaginateParams } from '~types/common'

export const getOffset = (page: number = 1, limit: number = 10) =>
  (page - 1) * limit

export const getLimit = (limit: number = 10) => limit

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

export const filterQueries = <T extends Record<string, unknown>>(
  query: T,
  ...args: string[]
): PaginateParams extends T ? T : PaginateParams => {
  return pick(
    query,
    paginateQueries(...args)
  ) as unknown as PaginateParams extends T ? T : PaginateParams
}

export const setQuerySortingNPagination = <T extends AnyPgTable>(
  query: DBQuery,
  params: PaginateParams,
  schema: T
) => {
  const { sortBy, sortOrder, page, limit } = params
  // Setting pagination
  query.limit = getLimit(limit)
  query.offset = getOffset(page, limit)

  // Settng sorting conditionally
  if (sortBy && (sortBy as unknown as 'string | number | symbol') in schema) {
    const sortKey = schema[
      sortBy as unknown as keyof typeof schema
    ] as unknown as AnyColumn

    query.orderBy = [getSortOrder(sortOrder || 'desc')(sortKey) as SQL<unknown>]
  }
}

export const getTotalCount = async <T extends AnyPgTable>(
  schema: T,
  findQuery: DBQuery['where']
) => {
  const [{ count: total }] = await db
    .select({ count: count() })
    .from(schema)
    .where(findQuery)
  return total
}
