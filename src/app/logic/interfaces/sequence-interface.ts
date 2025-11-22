export interface SequenceStep {
  id: number;
  order: number;
  description: string;
  imageUrl: string;
}

export interface Sequence {
  kind: 'secuencia',
  id: number;
  title: string;
  description: string;
  categorie: string;
  steps: SequenceStep[]; 
}