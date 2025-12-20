export interface Student { // Temporal
    kind: 'alumno',
    id: number,
    name: string,
    lastName: string,
    email: string,
    password: string,
    //grade: string,
    assignedSequences: number
}

export interface backStudent {
    id: number,
    nombre: string,
    apellidos: string,
    email: string,
    email_verified_at: string | null,
    created_at: string,
    updated_at: string
}

export interface backStudentRequest {
    id: number,
    nombre: string,
    apellidos: string,
    email: string,
    contrasena: string,
    contrasena_confirmation: string,
}

export interface backStudentDetails {
    usuario: backStudent
}