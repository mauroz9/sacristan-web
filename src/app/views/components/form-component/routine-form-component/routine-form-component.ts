import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../shared/loading-component/loading-component";
import { RutinasService } from '../../../../logic/services/rutinas-service';
import { ExtraService } from '../../../../logic/services/extras-service';
import { SecuenciasService } from '../../../../logic/services/secuencias-service';
import { ListCategoryResponse } from '../../../../logic/interfaces/extras-interface';
import { CreateRoutineRequest, UpdateRoutineRequest } from '../../../../logic/interfaces/rutinas-interface';
import { SequenceListResponse } from '../../../../logic/interfaces/secuencias-interface';

@Component({
  selector: 'app-routine-form-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LoadingComponent],
  templateUrl: './routine-form-component.html',
  styleUrl: './routine-form-component.css'
})
export class RoutineFormComponent implements OnInit {

  routineForm = new FormGroup({
    name: new FormControl('', Validators.required),
    categoryId: new FormControl<number | null>(null, Validators.required),
    daysOfTheWeek: new FormArray([]),
    sequences: new FormArray([])
  });

  isEditMode = false;
  routineId: number | null = null;
  categories: ListCategoryResponse[] = [];
  availableSequences: SequenceListResponse[] = [];
  loading = false;
  errorMessage: string | null = null;

  daysList = [
    { name: 'Lunes', value: 'MONDAY' },
    { name: 'Martes', value: 'TUESDAY' },
    { name: 'Miércoles', value: 'WEDNESDAY' },
    { name: 'Jueves', value: 'THURSDAY' },
    { name: 'Viernes', value: 'FRIDAY' },
    { name: 'Sábado', value: 'SATURDAY' },
    { name: 'Domingo', value: 'SUNDAY' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rutinasService: RutinasService,
    private extraService: ExtraService,
    private secuenciasService: SecuenciasService
  ) {
    this.daysList.forEach(() => this.daysFormArray.push(new FormControl(false)));
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  async loadInitialData() {
    this.loading = true;
    try {
      const cats = await firstValueFrom(this.extraService.getCategories());
      this.categories = cats.content;

      const seqs = await firstValueFrom(this.secuenciasService.list());
      this.availableSequences = seqs.content;

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isEditMode = true;
        this.routineId = Number(id);
        this.loadRoutineData(this.routineId);
      }
    } catch (e) {
    } finally {
      this.loading = false;
    }
  }

  loadRoutineData(id: number) {
    this.rutinasService.read(id).subscribe(routine => {
      this.routineForm.patchValue({
        name: routine.name,
        categoryId: routine.category?.id
      });

      this.daysList.forEach((day, index) => {
        if (routine.daysOfTheWeek.includes(day.value)) {
          this.daysFormArray.at(index).setValue(true);
        }
      });

      routine.sequences.forEach((rs: any) => {
        this.addSequenceToForm(rs.id, rs.sequence.id, rs.startTime, rs.endTime);
      });
    });
  }

  get daysFormArray() { return this.routineForm.get('daysOfTheWeek') as FormArray; }
  get sequencesFormArray() { return this.routineForm.get('sequences') as FormArray; }

  addSequenceToForm(id: number | null = null, sequenceId: number | null = null, start: string = '09:00', end: string = '10:00') {
    this.sequencesFormArray.push(new FormGroup({
      id: new FormControl(id),
      sequenceId: new FormControl(sequenceId, Validators.required),
      startTime: new FormControl(start, Validators.required),
      endTime: new FormControl(end, Validators.required)
    }, { validators: this.timeRangeValidator('startTime', 'endTime') }));
  }

  removeSequence(index: number) {
    this.sequencesFormArray.removeAt(index);
  }

  onSubmit() {
    if (this.routineForm.valid) {
      const selectedDays = this.routineForm.value.daysOfTheWeek
        ?.map((checked, i) => checked ? this.daysList[i].value : null)
        .filter(v => v !== null);

      const routine: CreateRoutineRequest | UpdateRoutineRequest = {
        name: this.routineForm.value.name!,
        categoryId: this.routineForm.value.categoryId!,
        daysOfTheWeek: selectedDays!,
        sequences: this.routineForm.value.sequences!
      };

      const request = this.isEditMode
        ? this.rutinasService.update(this.routineId!, routine as UpdateRoutineRequest)
        : this.rutinasService.create(routine);

      request.subscribe({
        next: () => {
          localStorage.setItem('infoMessage', this.isEditMode ? 'Rutina actualizada' : 'Rutina creada');
          this.router.navigate(['/routines']);
        },
        error: (err) => {
          this.errorMessage = err.error.detail || 'Error al guardar la rutina';

        }
      });
    } else {
      this.routineForm.markAllAsTouched();
    }
  }

  private timeRangeValidator(startField: string, endField: string) {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get(startField)?.value as string | null;
      const end = group.get(endField)?.value as string | null;

      if (!start || !end) return null;

      return start < end ? null : { invalidTimeRange: true };
    };
  }
}