import { QueryBuilder } from 'knex';
export declare const applyQuery: (queryBuilder: QueryBuilder, query: object, fuzzyFields?: string[], fieldsOperator?: object) => void;
export declare const applySorting: (queryBuilder: QueryBuilder, contextId: string, sort?: any, whiteList?: string) => void;
export declare const applyLimitAndOffset: (queryBuilder: QueryBuilder, offset?: number, limit?: number) => void;
