export const PREFIX_SEPARATOR = '__'

export const prefixTableColumn = (table: string, column: string) =>
    `${table}${PREFIX_SEPARATOR}${column}`

export const prefixTableColumns = (table: string, columns: string[]) =>
    columns.map(column => `${table}.${column} AS ${prefixTableColumn(table, column)}`)

export const extractWithPrefix = (prefix: string) => {
    const fullPrefix = `${prefix}${PREFIX_SEPARATOR}`

    return (data: any) =>
        Object.entries(data)
            .filter(([key, value]: [string, any]) => key.startsWith(fullPrefix))
            .reduce(
                (mapped: object, [key, value]: [string, any]) => ({
                    ...mapped,
                    [key.slice(fullPrefix.length)]: value
                }),
                {}
            )
}
