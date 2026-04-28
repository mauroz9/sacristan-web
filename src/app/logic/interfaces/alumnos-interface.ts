import { Page } from "./extras/utils/page-interface";

export interface StudentListResponse {
    id: number;
    name: string;
    lastName: string;
    sequencesCount: number;
    routinesCount: number;
    kind: 'estudiante';
}

export interface SequenceResponse {
    id: number;
    title: string;
    category: string | null;
}

export interface RoutineResponse {
    id: number;
    name: string;
    category: string | null;
}

export interface StudentDashboardResponse {
    stats: StudentStatsDTO;
    progresoSemanal: DailyProgressDTO[];
    categoriasTrabajadas: CategoryStatDTO[];
    secuenciasAsignadas: AssignedSequenceProgressDTO[];
    actividadReciente: RecentActivityDTO[];
}

export interface StudentStatsDTO {
    secuenciasCompletadasHoy: number;
    secuenciasPendientesHoy: number;
    tasaExito: number;
    tiempoPromedio: number;
    racha: number;
    ultimaActividad: string;
}

export interface DailyProgressDTO {
    date: string;
    completed: number;
}

export interface CategoryStatDTO {
    categoria: string;
    porcentaje: number;
}

export interface AssignedSequenceProgressDTO {
    id: number;
    nombre: string;
    categoria: string;
    franjaHoraria: string;
    estado: 'COMPLETADA' | 'PENDIENTE' | 'CADUCADA';
}

export interface RecentActivityDTO {
    id: number;
    secuencia: string;
    fecha: string;
    duracion: string;
    completada: boolean;
}

export type AgendaPageResponse = Page<AssignedSequenceProgressDTO>;

export type ActivityPageResponse = Page<RecentActivityDTO>;