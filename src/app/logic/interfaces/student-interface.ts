export interface Student { // Temporal
    kind: 'alumno',
    id: number,
    name: string,
    last_name: string,
    email: string,
    password?: string,
    assignedSequences: number
}