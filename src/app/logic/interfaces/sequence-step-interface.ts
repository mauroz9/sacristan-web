export interface Step {
  id: number;
  secuencia_id: number;
  nombre: string;
  posicion: number;
  pictograma_arasaac: string | null;
  pictograma_custom: string | null;
  created_at: string;
  updated_at: string;
}