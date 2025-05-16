import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        rules: {
            // Tắt các quy tắc đang gây vấn đề trong build
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            // Cho phép biến có tiền tố underscore không được sử dụng
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },
]

export default eslintConfig
