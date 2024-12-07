import test from 'ava';

import { CategoryTreeBuilder } from '..';
import { CORRECT } from '../correctResult';
import { INPUT } from '../input';

// Test successful category tree transformation
test('Transforms categories correctly', async (t) => {
  const getCategories = async () => ({ data: INPUT });

  const result = await CategoryTreeBuilder.fromQuery(getCategories);

  t.assert(result.length > 0);
  t.deepEqual(result, CORRECT);
});

// Test error handling
test('Handles API errors gracefully', async (t) => {
  const getCategories = async () => {
    throw new Error('API Error');
  };

  const result = await CategoryTreeBuilder.fromQuery(getCategories);
  
  t.deepEqual(result, []);
});

// Test empty data handling
test('Handles empty data correctly', async (t) => {
  const getCategories = async () => ({ data: [] });

  const result = await CategoryTreeBuilder.fromQuery(getCategories);

  t.deepEqual(result, []);
});
