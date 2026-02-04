import { Category } from "./category-sequence-interface";
import { Step, StepRequest } from "./sequence-step-interface";

export interface Sequence {
  kind: 'secuencia'
  id: number;
  title: string;
  description: string;
  estimatedDuration: string;
  allowGoBack: boolean;
  category: Category;
  steps: Step[];
}

export interface SequenceRequest {
  kind: 'secuencia'
  title: string;
  description: string;
  estimatedDuration: string | null;
  allowGoBack: boolean;
  categoryId: number;
  steps: StepRequest[];
}