import { CategoryOTreeNode, CategoryTreeNode  } from '../types/category';

import { OrderedTreeBuilder } from './baseTreeBuilder';

export class CategoryOTreeBuilder extends OrderedTreeBuilder<
  CategoryTreeNode,
  CategoryOTreeNode
> {
  private readonly HOME_CATEGORIES_LIMIT = 5;
  private readonly DEFAULT_HOME_CATEGORIES = 3;

  constructor() {
    super({
      getOrder: (category) => {
        const match = category.Title.match(/^([0-9]+)(#)?$/);
        return match ? Number(match[1]) : category.id;
      },
      transform: (category, order, children) => ({
        id: category.id,
        name: category.name,
        image: category.MetaTagDescription,
        order,
        children,
        showOnHome: false, // Initial value, will be set by setHomeFlags
      }),
    });
  }

  /**
   * Collects categories that have a '#' in their title. The `#` indicates that
   * the category should be shown on the home page. Only top-level categories
   * are considered.
   * @param categories The list of categories to search.
   * @returns A set of category IDs that match the criteria.
   */
  private collectHomeCategories(categories: CategoryTreeNode[]): Set<number> {
    return new Set(
      categories
        .filter((category) => category.Title.includes('#'))
        .map((category) => category.id)
    );
  }

  private setHomeFlags(
    tree: CategoryOTreeNode[],
    homeCategories: Set<number>
  ): void {
    if (tree.length <= this.HOME_CATEGORIES_LIMIT) {
      tree.forEach((node) => {
        node.showOnHome = true;
      });
      return;
    }

    if (homeCategories.size > 0) {
      tree.forEach((node) => {
        node.showOnHome = homeCategories.has(node.id);
      });
      return;
    }

    // Show default number of categories if no explicit ones marked
    for (let i = 0; i < this.DEFAULT_HOME_CATEGORIES && i < tree.length; i++) {
      tree[i].showOnHome = true;
    }
  }

  /**
   * Builds a list of ordered and formatted category tree nodes from a list of unordered and preprocessed category nodes.
   * @param categories The list of category tree nodes to build the tree from.
   * @returns The ordered and formatted category tree nodes.
   */
  public buildTree(categories: CategoryTreeNode[]): CategoryOTreeNode[] {
    if (!categories.length) return [];
    
    const tree = super.buildTree(categories);
    const homeCategories = this.collectHomeCategories(categories);
    this.setHomeFlags(tree, homeCategories);
    return tree;
  }

  /**
   * Creates a category tree from a query function that returns categories.
   * @param query Function that returns a promise with category data
   * @returns Promise with the built category tree
   */
  static async fromQuery(
    query: () => Promise<{ data: CategoryTreeNode[] }>
  ): Promise<CategoryOTreeNode[]> {
    try {
      const { data: categories } = await query();
      if (!categories.length) return [];

      const builder = new CategoryOTreeBuilder();
      return builder.buildTree(categories);
    } catch (error) {
      console.error('Error building category tree:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }
}
