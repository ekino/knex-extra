export const prefixTableColumns = (table: string, columns: string[]) =>
    columns.map(column => `${table}.${column} AS ${table}__${column}`)

export const extractWithPrefix = (prefix: string) => {
    const fullPrefix = `${prefix}__`

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
