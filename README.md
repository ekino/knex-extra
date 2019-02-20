# knexjs extra helpers

[![version](https://img.shields.io/npm/v/@ekino/knex-extra.svg?style=flat-square)](https://www.npmjs.com/package/@ekino/knex-extra)
![GitHub](https://img.shields.io/github/license/ekino/knex-extra.svg?style=flat-square)
[![Travis CI](https://img.shields.io/travis/ekino/knex-extra.svg?style=flat-square)](https://travis-ci.org/ekino/knex-extra)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/ekino/knex-extra/master.svg?style=flat-square)](https://codecov.io/gh/ekino/knex-extra/)

:warning: Work in progress :warning:

This package provides several helpers to be used with knex.

-   [installation](#installation)
-   [usage](#usage)
    -   [querying](#querying)
        -   [pagination](#pagination)
    -   [managing relations](#managing-relations)
        -   [one-to-one](#one-to-one-relations)
        -   [one-to-many](#one-to-many-relations)
    -   [prefix](#prefix)

## Installation

```sh
yarn add @ekino/knex-extra
```

## Usage

### Querying

#### Pagination

```typescript
import { applyLimitAndOffset } from '@ekino/knex-extra'
```

### Managing relations

Some drivers for knex do not support nesting results children,
for example when using joins, this package provide a handy helper
`nest` which ease the process of extracting relations.

When implemented, it will generate 2 functions, `selection()` which
can be used to automatically generate the columns to select,
and `rollup()` which can be used to transform rows to nested objects.

#### one-to-one relations

Let say we have `posts` and `users`, each post being authored by an `author` (user).
In order to define the relation from `posts` to `author`,
you'll have to implement something like that:

```typescript
import { nest } from '@ekino/knex-extra'

const postsRelations = nest('posts', ['id', 'title']).one('author', ['id', 'username'])

const findPostsWithAuthor = async () => {
    const rows = await knex
        .select(postsRelations.selection())
        // must match the table name defined when calling `.nest()`
        .from('posts')
        // note the usage of an alias (`author`), it's required
        // as it's the key we used when defining `.one()` relationship
        .leftJoin('users as author', 'author.id', 'posts.author_id')

    // for now, rows are flat objects with column names prefixed with table name:
    // [
    //   {
    //     posts__id: 1,
    //     posts__title: 'An interesting post',
    //     author__id: 12,
    //     author__username: 'plouc'
    //   },
    //   ...
    // ]
    // after applying `.rollup()`, table name will be removed from column names
    // and we'll have an `author` property on each one:
    // [
    //   {
    //     id: 1,
    //     title: 'An interesting post',
    //     author: {
    //       id: 12,
    //       username: 'plouc'
    //     }
    //   },
    //   ...
    // ]
    return postsRelations.rollup(rows)
}
```

#### one-to-many relations

```typescript
import { nest } from '@ekino/knex-extra'
```

### Prefix
