export interface Step {
  id: number;
  title: string;
  position: number;
  estimatedDuration: number;
  arasaacPictogramId: number | null;
  pictogram_custom: string | null;
}

export interface StepRequest {
  title: string;
  position: number;
  estimatedDuration: string;
  arasaacPictogramId: number | null;
  sequenceId: number;
}