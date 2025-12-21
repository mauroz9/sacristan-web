export interface Step {
  id: number;
  sequence_id: number;
  title: string;
  position: number;
  pictogram_arasaac: string | null;
  pictogram_custom: string | null;
  created_at: string;
  updated_at: string;
}