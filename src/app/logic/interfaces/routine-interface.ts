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