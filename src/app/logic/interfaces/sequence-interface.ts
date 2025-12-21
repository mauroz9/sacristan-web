import { Category } from "./category-sequence-interface";
import { Step } from "./sequence-step-interface";

export interface Sequence {
  kind: 'secuencia'
  id: number;
  sequence_category_id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  category: Category;
  steps: Step[];
}