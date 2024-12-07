import { Category } from './mockedApi';

export interface CategoryTreeNode {
  id: number;
  name: string;
  image: string;
  order: number;
  children: CategoryTreeNode[];
  showOnHome: boolean;
}

export type CategoriesQuery = () => Promise<{ data: Category[] }>;

export class CategoryTreeBuilder {
  private readonly HOME_CATEGORIES_LIMIT = 5;
  private readonly DEFAULT_HOME_CATEGORIES = 3;

  /**
   * Builds an ordered category tree from a query that returns an array of categories.
   * The query should return an array of categories with the following structure:
   * 
   * {
   *   id: number;
   *   name: string;
   *   image: string;
   *   order: number;
   *   children: CategoryTreeNode[];
   *   showOnHome: boolean;
   * }
   */
  static async fromQuery(categoriesQuery: CategoriesQuery): Promise<CategoryTreeNode[]> {
    try {
      const { data: categories } = await categoriesQuery();
      if (!categories?.length) return [];

      const builder = new CategoryTreeBuilder();
      return builder.buildTree(categories);
    } catch (error) {
      console.error('Error while fetching categories:', error);
      return [];
    }
  }

  private extractOrderFromTitle(title: string): number | null {
    const match = title.match(/^([0-9]+)(#)?$/);
    return match ? Number(match[1]) : null;
  }

  private determineOrder(category: Category): number {
    const orderFromTitle = this.extractOrderFromTitle(category.Title);
    return orderFromTitle ?? category.id;
  }

  private transformToTreeNode(category: Category): CategoryTreeNode {
    return {
      id: category.id,
      name: category.name,
      image: category.MetaTagDescription,
      order: this.determineOrder(category),
      children: category.hasChildren
        ? category.children
            .map(child => this.transformToTreeNode(child))
            .sort((a, b) => a.order - b.order)
        : [],
      showOnHome: false,
    };
  }

  private collectHomeCategories(categories: Category[]): Set<number> {
    return new Set(
      categories
        .filter(category => category.Title.includes('#'))
        .map(category => category.id)
    );
  }

  private setHomeFlags(tree: CategoryTreeNode[], homeCategories: Set<number>): void {
    if (tree.length <= this.HOME_CATEGORIES_LIMIT) {
      tree.forEach(category => (category.showOnHome = true));
      return;
    }

    if (homeCategories.size > 0) {
      tree.forEach(category => {
        category.showOnHome = homeCategories.has(category.id);
      });
      return;
    }

    // Show default number of categories if no explicit ones marked
    tree.slice(0, this.DEFAULT_HOME_CATEGORIES)
        .forEach(category => (category.showOnHome = true));
  }

  buildTree(categories: Category[]): CategoryTreeNode[] {
    if (!categories.length) return [];

    const homeCategories = this.collectHomeCategories(categories);
    const tree = categories
      .map(category => this.transformToTreeNode(category))
      .sort((a, b) => a.order - b.order);

    this.setHomeFlags(tree, homeCategories);
    return tree;
  }
}

