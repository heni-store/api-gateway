import { Locale, Difficulty } from '@prisma/client';

export const problems = [
  {
    slug: 'bubble-sort',
    difficulty: Difficulty.EASY,
    translations: [
      {
        locale: Locale.RU,
        title: 'Сортировка пузырьком',
        description:
          'Реализуйте алгоритм пузырьковой сортировки массива чисел.',
        examples: [{ input: '[5,1,4,2,8]', output: '[1,2,4,5,8]' }],
        constraints: ['1 <= arr.length <= 10^4', '-10^9 <= arr[i] <= 10^9'],
        starterCode: {
          typescript:
            'export function bubbleSort(arr: number[]): number[] {\n  return arr;\n}',
          python: 'def bubble_sort(arr):\n    return arr',
        },
        tags: ['arrays', 'sorting'],
      },
      {
        locale: Locale.EN,
        title: 'Bubble Sort',
        description:
          'Implement the bubble sort algorithm for an array of numbers.',
        examples: [{ input: '[5,1,4,2,8]', output: '[1,2,4,5,8]' }],
        constraints: ['1 <= arr.length <= 10^4', '-10^9 <= arr[i] <= 10^9'],
        starterCode: {
          typescript:
            'export function bubbleSort(arr: number[]): number[] {\n  return arr;\n}',
          python: 'def bubble_sort(arr):\n    return arr',
        },
        tags: ['arrays', 'sorting'],
      },
    ],
    testCases: [
      { input: '[5,1,4,2,8]', output: '[1,2,4,5,8]', isHidden: false },
      { input: '[3,2,1]', output: '[1,2,3]', isHidden: true },
    ],
  },
  {
    slug: 'sum-array',
    difficulty: Difficulty.MEDIUM,
    translations: [],
    testCases: [],
  },
];
