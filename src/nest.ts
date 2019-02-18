import * as _ from 'lodash'
import { prefixTableColumn, prefixTableColumns, extractWithPrefix } from './prefix'

interface Relation {
    add(child: any): void
    extract(node: any, row: any): void
}

const relationSingle = (table: string, column: string, defaultValue: any): Relation => {
    const childrenRelations: Relation[] = []

    return {
        add(childRelation: Relation) {
            childrenRelations.push(childRelation)
        },
        extract(node: any, row: any) {
            if (row[prefixTableColumn(table, column)] !== null) {
                let childNode = node[table]
                if (!childNode) {
                    childNode = extractWithPrefix(table)(row)
                    node[table] = childNode
                }

                childrenRelations.forEach(relation => relation.extract(childNode, row))
            } else {
                node[table] = defaultValue
            }
        }
    }
}

const relationMany = (table: string, column: string): Relation => {
    const childrenRelations: Relation[] = []

    return {
        add(childRelation: Relation) {
            childrenRelations.push(childRelation)
        },
        extract(node: any, row: any) {
            if (row[prefixTableColumn(table, column)] !== null) {
                if (!_.has(node, table)) node[table] = []

                let childNode = _.find(node[table], {
                    [column]: row[prefixTableColumn(table, column)]
                })
                if (!childNode) {
                    childNode = extractWithPrefix(table)(row)
                    node[table].push(childNode)
                }

                childrenRelations.forEach(relation => relation.extract(childNode, row))
            } else {
                node[table] = []
            }
        }
    }
}

class Nest {
    private parentTable: string
    private parentColumns: string[]
    private extra: any[]
    private groupBy: string
    private select: string[]
    private relations: Relation[]
    private relationsByPath: { [key: string]: Relation }

    constructor(table: string, columns: string[], { extra = [] }: { extra?: any[] } = {}) {
        this.parentTable = table
        this.parentColumns = columns
        this.extra = extra
        this.groupBy = columns[0]

        this.select = prefixTableColumns(this.parentTable, this.parentColumns)

        this.relations = []
        this.relationsByPath = {}
    }

    private register(table: string, relation: Relation, parent?: any) {
        let path = table
        if (parent !== undefined) {
            const parentRelation = this.relationsByPath[parent]
            if (!this.relationsByPath[parent]) {
                throw new Error(`Unable to create nesting, no relation found for path: "${parent}"`)
            }

            parentRelation.add(relation)

            path = `${parent}.${table}`
        } else {
            this.relations.push(relation)
        }

        this.relationsByPath[path] = relation
    }

    public one(table: string, fields: string[], options: { default?: any; parent?: any } = {}) {
        this.select = this.select.concat(prefixTableColumns(table, fields))

        const relation = relationSingle(table, fields[0], options.default || null)
        this.register(table, relation, options.parent)

        return this
    }

    public many(table: string, fields: string[], options: { parent?: any } = {}) {
        this.select = this.select.concat(prefixTableColumns(table, fields))

        const relation = relationMany(table, fields[0])
        this.register(table, relation, options.parent)

        return this
    }

    public selection(): string[] {
        return this.select
    }

    public rollup(rows: any[]) {
        if (rows.length === 0) return []

        return rows.reduce((rootNodes, row) => {
            let rootNode = rootNodes.find(
                (rn: any) =>
                    rn[this.groupBy] === row[`${prefixTableColumn(this.parentTable, this.groupBy)}`]
            )

            if (rootNode === undefined) {
                rootNode = extractWithPrefix(this.parentTable)(row)
                this.extra.forEach(key => {
                    rootNode[key] = row[key]
                })
                rootNodes.push(rootNode)
            }

            this.relations.forEach(rel => rel.extract(rootNode, row))

            return rootNodes
        }, [])
    }
}

export const nest = (table: string, columns: string[], options?: { extra?: any[] }) =>
    new Nest(table, columns, options)
