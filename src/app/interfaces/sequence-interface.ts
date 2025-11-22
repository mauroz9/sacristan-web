export interface SequenceStep {
  id: number;
  order: number;
  description: string;
  imageUrl: string;
}

export interface Sequence {
  id: number;
  title: string;
  description: string;
  categorie: string;
  steps: SequenceStep[]; 
}