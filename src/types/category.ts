import { OrderedTreeNode, TreeNode } from '../core/baseTreeBuilder';

export type CategoryTreeNode = TreeNode<{
  name: string;
  Title: string;
  MetaTagDescription: string;
  url: string;
  hasChildren: boolean;
}>;

export type CategoryOTreeNode = OrderedTreeNode<{
  name: string;
  image: string;
  showOnHome: boolean;
}>;
