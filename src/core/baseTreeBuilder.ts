// Base type for any input that can be transformed into a tree node
export type TreeNode<T = Record<string, unknown>> = {
  id: number;
  children?: TreeNode<T>[];
} & T;

// Base type for any tree node output
export type OrderedTreeNode<T = Record<string, unknown>> = {
  id: number;
  order: number;
  children: OrderedTreeNode<T>[];
} & T;

// Configuration for ordered tree building
export interface OrderedTreeBuilderConfig<
  TData = Record<string, unknown>,
  R extends OrderedTreeNode<Record<string, unknown>> = OrderedTreeNode<
    Record<string, unknown>
  >
> {
  getOrder: (input: TreeNode<TData>) => number;
  transform: (input: TreeNode<TData>, order: number, children: R[]) => R;
}

export class OrderedTreeBuilder<
  TData extends TreeNode = TreeNode,
  R extends OrderedTreeNode = OrderedTreeNode
> {
  protected readonly config: OrderedTreeBuilderConfig<TData, R>;

  constructor(config?: Partial<OrderedTreeBuilderConfig<TData, R>>) {
    this.config = {
      getOrder: (input: TreeNode<TData>) => input.id,
      transform: (input: TreeNode<TData>, order: number, children: R[]): R => {
        const result = {
          ...input,
          order,
          children,
        };
        return result as R;
      },
      ...config,
    };
  }

  protected transformToTreeNode(input: TreeNode<TData>): R {
    const order = this.config.getOrder(input);
    const children = input.children?.length
      ? (input.children as TreeNode<TData>[])
          .map((child) => this.transformToTreeNode(child))
          .sort((a, b) => a.order - b.order)
      : [];

    return this.config.transform(input, order, children);
  }

  public buildTree(items: TreeNode<TData>[]): R[] {
    return items
      .map((item) => this.transformToTreeNode(item))
      .sort((a, b) => a.order - b.order);
  }
}
