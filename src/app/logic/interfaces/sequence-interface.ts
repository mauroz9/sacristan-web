import { Category } from "./category-sequence-interface";
import { Step } from "./sequence-step-interface";

export interface Sequence {
  id: number;
  categoria_id: number;
  titulo: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
  categoria: Category;
  pasos: Step[];
}