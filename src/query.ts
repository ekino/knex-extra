import { QueryBuilder } from 'knex'

/*
export const applyQuery = (
    queryBuilder: QueryBuilder,
    query: object,
    fuzzyFields: string[] = [],
    fieldsOperator: object = {}
) => {
    Object.keys(query).forEach(key => {
        const value = query[key]
        const operator = fieldsOperator[key] || '='

        if (Array.isArray(value)) {
            queryBuilder.where(function() {
                this.whereIn(key, value.filter(item => item !== null))
                if (value.includes(null)) {
                    this.orWhereNull(key)
                }
            })
        } else {
            if (value === null) queryBuilder.whereNull(key)
            else if (fuzzyFields.includes(key)) {
                queryBuilder.where(key, 'ilike', `%${value}%`)
            } else {
                queryBuilder.where(key, operator, value)
            }
        }
    })
}

/**
 * Apply sorting directive(s) to query builder.
 *
 * @param {Object}                queryBuilder    - The queryBuilder
 * @param {string}                contextId       - The contextId
 * @param {Array.<Array>}         [sort=null]     - The sorting directives we want to apply
 * @param {string|Array.<string>} [whiteList='*'] - The fields we can sort on
 *
export const applySorting = (
    queryBuilder: QueryBuilder,
    contextId: string,
    sort = null,
    whiteList = '*'
) => {
    if (sort !== null) {
        sort.forEach(([field, direction]) => {
            if (whiteList === '*' || (Array.isArray(whiteList) && whiteList.includes(field))) {
                queryBuilder.orderBy(field, direction)
            } else {
                /*
                log.debug(
                    contextId,
                    `Invalid sort field '${field}' provided, must be one of: [${whiteList.join(
                        ', '
                    )}]`,
                    {
                        field,
                        whiteList
                    }
                )
            }
        })
    }
}
*/

export const applyLimitAndOffset = (
    queryBuilder: QueryBuilder,
    offset?: number,
    limit?: number
) => {
    if (offset !== undefined) {
        queryBuilder.offset(Number(offset))
    }
    if (limit !== undefined) {
        queryBuilder.limit(Number(limit))
    }
}
