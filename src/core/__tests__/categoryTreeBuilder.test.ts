import test from 'ava';

import { CategoryTreeNode } from '../../types/category';
import { CategoryOTreeBuilder } from '../categoryTreeBuilder';

import { CORRECT } from './__fixtures__/correctResult';
import { getCategories } from './__fixtures__/mockedApi';

// Test successful category tree transformation
test('Transforms categories correctly', async (t) => {
  const result = await CategoryOTreeBuilder.fromQuery(getCategories);

  t.assert(result.length > 0);
  t.deepEqual(result, CORRECT);
});

// Test direct tree building without query
test('Builds tree directly from categories', (t) => {
  const categories: CategoryTreeNode[] = [
    {
      id: 1,
      name: 'Category 1',
      hasChildren: true,
      Title: '1#',
      MetaTagDescription: 'desc1',
      url: '/cat1',
      children: [
        {
          id: 2,
          name: 'Child 1',
          hasChildren: false,
          Title: '2',
          MetaTagDescription: 'desc2',
          url: '/cat1/child1',
          children: []
        }
      ]
    }
  ];

  const builder = new CategoryOTreeBuilder();
  const result = builder.buildTree(categories);

  t.is(result.length, 1);
  t.is(result[0].children.length, 1);
  t.true(result[0].showOnHome);
  t.is(result[0].order, 1);
});

// Test home category selection with explicit flags
test('Sets home categories based on # in title, when there is more than 5 input categories.', (t) => {
  const categories: CategoryTreeNode[] = [
    { id: 1, name: 'Cat 1', Title: '1', hasChildren: false, MetaTagDescription: 'desc1', url: '/1', children: [] },
    { id: 2, name: 'Cat 2', Title: '2#', hasChildren: false, MetaTagDescription: 'desc2', url: '/2', children: [] },
    { id: 3, name: 'Cat 3', Title: '3#', hasChildren: false, MetaTagDescription: 'desc3', url: '/3', children: [] },
    { id: 4, name: 'Cat 4', Title: '4', hasChildren: false, MetaTagDescription: 'desc4', url: '/4', children: [] },
    { id: 5, name: 'Cat 5', Title: '5', hasChildren: false, MetaTagDescription: 'desc5', url: '/5', children: [] },
    { id: 6, name: 'Cat 6', Title: '6#', hasChildren: false, MetaTagDescription: 'desc6', url: '/6', children: [] }
  ];

  const builder = new CategoryOTreeBuilder();
  const result = builder.buildTree(categories);

  t.false(result[0].showOnHome);
  t.true(result[1].showOnHome);
  t.true(result[2].showOnHome);
  t.false(result[3].showOnHome);
  t.false(result[4].showOnHome);
  t.true(result[5].showOnHome);
});

// Test default home category selection
test('Shows first 3 categories on home when no explicit flags', (t) => {
  const categories: CategoryTreeNode[] = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `Cat ${i + 1}`,
    Title: String(i + 1),
    hasChildren: false,
    MetaTagDescription: `desc${i + 1}`,
    url: `/${i + 1}`,
    children: []
  }));

  const builder = new CategoryOTreeBuilder();
  const result = builder.buildTree(categories);

  t.true(result[0].showOnHome);
  t.true(result[1].showOnHome);
  t.true(result[2].showOnHome);
  t.false(result[3].showOnHome);
  t.false(result[4].showOnHome);
  t.false(result[5].showOnHome);
});

test('Shows all categories on home when input size is 5 or less, regardless of explicit flags', (t) => {
  // Test for each possible length from 1 to 5
  for (let length = 1; length <= 5; length++) {
    const categories: CategoryTreeNode[] = Array.from({ length }, (_, i) => ({
      id: i + 1,
      name: `Cat ${i + 1}`,
      Title: String(i + 1) + (i === 0 || i === length - 1 ? '#' : ''), // Set # for first and last
      hasChildren: false,
      MetaTagDescription: `desc${i + 1}`,
      url: `/${i + 1}`,
      children: []
    }));

    const builder = new CategoryOTreeBuilder();
    const result = builder.buildTree(categories);

    // Verify length
    t.is(result.length, length, `Expected ${length} categories in result`);

    // Verify all categories are shown on home
    result.forEach((category, index) => {
      t.true(category.showOnHome, `Category at index ${index} should be shown on home when total length is ${length}`);
    });
  }
});

// Test ordering logic
test('Orders categories based on title numbers', (t) => {
  const categories: CategoryTreeNode[] = [
    { id: 1, name: 'Cat A', Title: '3', hasChildren: false, MetaTagDescription: 'descA', url: '/a', children: [] },
    { id: 2, name: 'Cat B', Title: '1', hasChildren: false, MetaTagDescription: 'descB', url: '/b', children: [] },
    { id: 3, name: 'Cat C', Title: '2', hasChildren: false, MetaTagDescription: 'descC', url: '/c', children: [] }
  ];

  const builder = new CategoryOTreeBuilder();
  const result = builder.buildTree(categories);

  t.is(result[0].name, 'Cat B');
  t.is(result[1].name, 'Cat C');
  t.is(result[2].name, 'Cat A');
});

// Test error handling
test('Handles API errors gracefully', async (t) => {
  const getCategories = async () => {
    throw new Error('API Error');
  };

  const result = await CategoryOTreeBuilder.fromQuery(getCategories);
  t.deepEqual(result, []);
});

// Test empty data handling
test('Handles empty data correctly', async (t) => {
  const getCategories = async () => ({ data: [] });

  const result = await CategoryOTreeBuilder.fromQuery(getCategories);
  t.deepEqual(result, []);
});

test('buildTree returns empty array when given empty input', (t) => {
  const builder = new CategoryOTreeBuilder();
  const result = builder.buildTree([]);
  t.deepEqual(result, [], 'Should return empty array when given empty input');
});

test('Handles non-Error objects in catch block', async (t) => {
  const getCategories = async () => {
    throw 'String error'; // This will trigger the 'Unknown error' branch
  };

  const result = await CategoryOTreeBuilder.fromQuery(getCategories);
  t.deepEqual(result, []);
});
