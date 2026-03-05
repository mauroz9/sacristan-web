import { Category } from "./category-sequence-interface";
import { Sequence } from "./sequence-interface";

export interface RoutineSequence {
    id: number;
    sequence: Sequence;
    startTime: string;
    endTime: string;
}

export interface Routine {
    kind: 'rutina'
    id: number;
    name: string;
    category: Category;
    daysOfTheWeek: string[];
    sequences: RoutineSequence[];
}

export interface RoutineList {
    id: number;
    name: string;
    daysOfWeek: string[];
    category: Category;
}

export interface RoutineRequest {
    name: string;
    categoryId: number;
    daysOfTheWeek: string[];
    sequences: SequenceRoutineRequest[];
}

export interface SequenceRoutineRequest {
    sequenceId: number;
    startTime: string;
    endTime: string;
}