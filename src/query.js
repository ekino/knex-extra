"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyQuery = (queryBuilder, query, fuzzyFields = [], fieldsOperator = {}) => {
    Object.keys(query).forEach(key => {
        const value = query[key];
        const operator = fieldsOperator[key] || '=';
        if (Array.isArray(value)) {
            queryBuilder.where(function () {
                this.whereIn(key, value.filter(item => item !== null));
                if (value.includes(null)) {
                    this.orWhereNull(key);
                }
            });
        }
        else {
            if (value === null)
                queryBuilder.whereNull(key);
            else if (fuzzyFields.includes(key)) {
                queryBuilder.where(key, 'ilike', `%${value}%`);
            }
            else {
                queryBuilder.where(key, operator, value);
            }
        }
    });
};
exports.applySorting = (queryBuilder, contextId, sort = null, whiteList = '*') => {
    if (sort !== null) {
        sort.forEach(([field, direction]) => {
            if (whiteList === '*' || (Array.isArray(whiteList) && whiteList.includes(field))) {
                queryBuilder.orderBy(field, direction);
            }
            else {
            }
        });
    }
};
exports.applyLimitAndOffset = (queryBuilder, offset, limit) => {
    if (offset !== undefined) {
        queryBuilder.offset(Number(offset));
    }
    if (limit !== undefined) {
        queryBuilder.limit(Number(limit));
    }
};
//# sourceMappingURL=query.js.map