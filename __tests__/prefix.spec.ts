import { prefixTableColumns, extractWithPrefix } from '../src/prefix'

describe('prefixTableColumns', () => {
    test('it should generate corresponding array of columns selection', () => {
        const selection = prefixTableColumns('posts', ['id', 'title', 'created_at', 'updated_at'])

        expect(selection).toEqual([
            'posts.id AS posts__id',
            'posts.title AS posts__title',
            'posts.created_at AS posts__created_at',
            'posts.updated_at AS posts__updated_at'
        ])
    })
})

describe('extractWithPrefix', () => {
    test('it should map prefixed columns to unprefixed ones', () => {
        const extract = extractWithPrefix('posts')
        const extracted = extract({
            posts__id: 3,
            posts__name: 'An interesting post',
            posts__created_at: 'yesterday',
            posts__updated_at: 'today'
        })

        expect(extracted).toEqual({
            id: 3,
            name: 'An interesting post',
            created_at: 'yesterday',
            updated_at: 'today'
        })
    })
})