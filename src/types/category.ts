export interface Category {
  id: number;
  name: string;
  hasChildren: boolean;
  Title: string;
  MetaTagDescription: string;
  url: string;
  children: Category[];
}

export interface CategoryTreeNode {
  id: number;
  name: string;
  image: string;
  order: number;
  children: CategoryTreeNode[];
  showOnHome: boolean;
}
