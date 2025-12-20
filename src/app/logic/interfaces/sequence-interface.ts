import { Category } from "./category-sequence-interface";
import { Step } from "./sequence-step-interface";

export interface Sequence {
  kind: 'secuencia',
  id: number;
  categoria_id: number;
  titulo: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
}

export interface SequenceWithDetails {
  id: number;
  categoria_id: number;
  titulo: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
  categoria: Category;
  pasos: Step[];
}