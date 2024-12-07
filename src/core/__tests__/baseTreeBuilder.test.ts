import test from 'ava';

import {
  OrderedTreeBuilder,
  OrderedTreeNode,
  TreeNode,
} from '../baseTreeBuilder';

// Test implementation types
type TestNode = TreeNode<{
  name: string;
}>;

type TestOrderedNode = OrderedTreeNode<{
  name: string;
}>;

// Test helper to create a simple builder instance
function createTestBuilder() {
  return new OrderedTreeBuilder<TestNode, TestOrderedNode>({
    transform: (input, order, children) => ({
      id: input.id,
      name: input.name,
      order,
      children,
    }),
  });
}

test('OrderedTreeBuilder should transform a single node', (t) => {
  const builder = createTestBuilder();
  const input: TestNode = { id: 1, name: 'Root' };

  const result = builder.buildTree([input]);

  t.deepEqual(result, [
    {
      id: 1,
      name: 'Root',
      order: 1,
      children: [],
    },
  ]);
});

test('OrderedTreeBuilder should transform and order nodes by id', (t) => {
  const builder = createTestBuilder();
  const inputs: TestNode[] = [
    { id: 2, name: 'Second' },
    { id: 1, name: 'First' },
    { id: 3, name: 'Third' },
  ];

  const result = builder.buildTree(inputs);

  t.deepEqual(result, [
    {
      id: 1,
      name: 'First',
      order: 1,
      children: [],
    },
    {
      id: 2,
      name: 'Second',
      order: 2,
      children: [],
    },
    {
      id: 3,
      name: 'Third',
      order: 3,
      children: [],
    },
  ]);
});

test('OrderedTreeBuilder should transform nested nodes and maintain order', (t) => {
  const builder = createTestBuilder();
  const input: TestNode = {
    id: 1,
    name: 'Root',
    children: [
      {
        id: 3,
        name: 'Child 2',
      },
      {
        id: 2,
        name: 'Child 1',
      },
    ],
  };

  const result = builder.buildTree([input]);

  t.deepEqual(result, [
    {
      id: 1,
      name: 'Root',
      order: 1,
      children: [
        {
          id: 2,
          name: 'Child 1',
          order: 2,
          children: [],
        },
        {
          id: 3,
          name: 'Child 2',
          order: 3,
          children: [],
        },
      ],
    },
  ]);
});

test('OrderedTreeBuilder should use custom order function', (t) => {
  const builder = new OrderedTreeBuilder<TestNode, TestOrderedNode>({
    getOrder: (input) => input.id * 10,
    transform: (input, order, children) => ({
      id: input.id,
      name: input.name,
      order,
      children,
    }),
  });

  const inputs: TestNode[] = [
    { id: 2, name: 'Second' },
    { id: 1, name: 'First' },
  ];

  const result = builder.buildTree(inputs);

  t.deepEqual(result, [
    {
      id: 1,
      name: 'First',
      order: 10,
      children: [],
    },
    {
      id: 2,
      name: 'Second',
      order: 20,
      children: [],
    },
  ]);
});

test('OrderedTreeBuilder should handle empty children array', (t) => {
  const builder = createTestBuilder();
  const input: TestNode = {
    id: 1,
    name: 'Root',
    children: [],
  };

  const result = builder.buildTree([input]);

  t.deepEqual(result, [
    {
      id: 1,
      name: 'Root',
      order: 1,
      children: [],
    },
  ]);
});

test('OrderedTreeBuilder should handle undefined children', (t) => {
  const builder = createTestBuilder();
  const input: TestNode = {
    id: 1,
    name: 'Root',
  };

  const result = builder.buildTree([input]);

  t.deepEqual(result, [
    {
      id: 1,
      name: 'Root',
      order: 1,
      children: [],
    },
  ]);
});

test('OrderedTreeBuilder should use default transform when no transform is provided', (t) => {
  const builder = new OrderedTreeBuilder();
  const input: TreeNode = {
    id: 1,
    extraField: 'test value',
    children: [
      {
        id: 2,
        extraField: 'test value',
      },
    ],
  };

  const result = builder.buildTree([input]);

  t.deepEqual(result, [
    {
      id: 1,
      extraField: 'test value',
      order: 1,
      children: [
        {
          id: 2,
          extraField: 'test value',
          order: 2,
          children: [],
        },
      ],
    },
  ]);
});
