import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoutineService } from '../../../../logic/services/routine-service';
import { CategorySequenceService } from '../../../../logic/services/category-sequence-service';
import { SequenceService } from '../../../../logic/services/sequence-service';
import { Category } from '../../../../logic/interfaces/category-sequence-interface';
import { Sequence } from '../../../../logic/interfaces/sequence-interface';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../shared/loading-component/loading-component";
import { RoutineRequest } from '../../../../logic/interfaces/routine-interface';

@Component({
  selector: 'app-routine-form-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoadingComponent],
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
  categories: Category[] = [];
  availableSequences: Sequence[] = [];
  loading = false;

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
    private routineService: RoutineService,
    private categoryService: CategorySequenceService,
    private sequenceService: SequenceService
  ) {
    this.daysList.forEach(() => this.daysFormArray.push(new FormControl(false)));
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  async loadInitialData() {
    this.loading = true;
    try {
      const cats = await firstValueFrom(this.categoryService.getCategories());
      this.categories = cats.content;
      
      const seqs = await firstValueFrom(this.sequenceService.getSequences());
      this.availableSequences = seqs.content;

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isEditMode = true;
        this.routineId = Number(id);
        this.loadRoutineData(this.routineId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  loadRoutineData(id: number) {
    this.routineService.getRoutineById(id).subscribe(routine => {
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
        this.addSequenceToForm(rs.sequence.id, rs.startTime, rs.endTime);
      });
    });
  }

  get daysFormArray() { return this.routineForm.get('daysOfTheWeek') as FormArray; }
  get sequencesFormArray() { return this.routineForm.get('sequences') as FormArray; }

  addSequenceToForm(sequenceId: number | null = null, start: string = '09:00', end: string = '10:00') {
    this.sequencesFormArray.push(new FormGroup({
      sequenceId: new FormControl(sequenceId, Validators.required),
      startTime: new FormControl(start, Validators.required),
      endTime: new FormControl(end, Validators.required)
    }));
  }

  removeSequence(index: number) {
    this.sequencesFormArray.removeAt(index);
  }

  onSubmit() {
    if (this.routineForm.valid) {
      const selectedDays = this.routineForm.value.daysOfTheWeek
        ?.map((checked, i) => checked ? this.daysList[i].value : null)
        .filter(v => v !== null);

      const routine: RoutineRequest = {
        name: this.routineForm.value.name!,
        categoryId: this.routineForm.value.categoryId!,
        daysOfTheWeek: selectedDays!,
        sequences: this.routineForm.value.sequences!
      };

      const request = this.isEditMode 
        ? this.routineService.modifyRoutine(this.routineId!, routine)
        : this.routineService.addRoutine(routine);

      request.subscribe({
        next: () => {
          localStorage.setItem('infoMessage', this.isEditMode ? 'Rutina actualizada' : 'Rutina creada');
          this.router.navigate(['/routines']);
        },
        error: (err) => alert("Error al guardar: " + err.message)
      });
    } else {
      this.routineForm.markAllAsTouched();
    }
  }
}