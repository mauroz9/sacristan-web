import { Component, input, output, signal, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, finalize, of } from 'rxjs';
import {
  AssignedSequenceProgressDTO,
  CategoryStatDTO,
  DailyProgressDTO,
  RecentActivityDTO,
  StudentStatsDTO,
  AgendaPageResponse,
  ActivityPageResponse
} from '../../../logic/interfaces/alumnos-interface';
import { AlumnosService } from '../../../logic/services/alumnos-service';


import { Chart, registerables } from 'chart.js';
import { LoadingComponent } from '../shared/loading-component/loading-component';
Chart.register(...registerables);

@Component({
  selector: 'app-alumno-detail-view-component',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './alumno-detail-view-component.html',
  styleUrl: './alumno-detail-view-component.css',
})
export class AlumnoDetailViewComponent implements OnInit, OnChanges {

  alumnoInput = input<any>(undefined, { alias: 'alumno' });
  alumno = signal<any>(null);
  onClose = output<void>();
  onEdit = output<any>();
  isLoading = signal<boolean>(true);

  weeklyChart: any;
  categoryChart: any;

  agendaCurrentPage = 0;
  actividadCurrentPage = 0;
  pageSize = 5;

  agendaData?: AgendaPageResponse;
  activityData?: ActivityPageResponse;

  stats: StudentStatsDTO = {
    secuenciasCompletadasHoy: 0, secuenciasPendientesHoy: 0, tasaExito: 0,
    tiempoPromedio: 0, racha: 0, ultimaActividad: '...'
  };

  progresoSemanal: DailyProgressDTO[] = [];
  categoriasTrabajadas: CategoryStatDTO[] = [];
  secuenciasAsignadas: AssignedSequenceProgressDTO[] = [];
  actividadReciente: RecentActivityDTO[] = [];

  constructor(
    private alumnosService: AlumnosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadStudentAndData(+id);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['alumnoInput']) {
      const student = this.alumnoInput();
      if (student?.id) {
        this.alumno.set(student);
        this.fetchDashboardData(student.id);
      }
    }
  }

  loadStudentAndData(id: number): void {
    this.isLoading.set(true);
    this.alumnosService.read(id).subscribe({
      next: (student: any) => {
        this.alumno.set(student);
        this.fetchDashboardData(id);
      },
      error: (err) => {
        console.error('Error al cargar al alumno', err);
        this.volver();
      }
    });
  }

  fetchDashboardData(studentId: number): void {
    this.isLoading.set(true);

    this.agendaCurrentPage = 0;
    this.actividadCurrentPage = 0;

    forkJoin({
      stats: this.alumnosService.getStudentStats(studentId).pipe(
        catchError((err) => {
          console.error('Error al cargar las estadísticas del alumno', err);
          alert('No se pudieron cargar las estadísticas del alumno.');
          return of(this.stats);
        })
      ),
      weekly: this.alumnosService.getWeeklyProgress(studentId).pipe(
        catchError((err) => {
          console.error('Error al cargar el progreso semanal', err);
          return of([] as DailyProgressDTO[]);
        })
      ),
      categories: this.alumnosService.getCategoryStats(studentId).pipe(
        catchError((err) => {
          console.error('Error al cargar las categorías trabajadas', err);
          return of([] as CategoryStatDTO[]);
        })
      ),
      agenda: this.alumnosService.getStudentAgenda(studentId, this.agendaCurrentPage, this.pageSize).pipe(
        catchError((err) => {
          console.error('Error al cargar la agenda del alumno', err);
          return of({
            content: [],
            page: { number: 0, size: this.pageSize, totalElements: 0, totalPages: 0 }
          } as AgendaPageResponse);
        })
      ),
      activity: this.alumnosService.getStudentActivity(studentId, this.actividadCurrentPage, this.pageSize).pipe(
        catchError((err) => {
          console.error('Error al cargar la actividad reciente', err);
          return of({
            content: [],
            page: { number: 0, size: this.pageSize, totalElements: 0, totalPages: 0 }
          } as ActivityPageResponse);
        })
      )
    }).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: ({ stats, weekly, categories, agenda, activity }) => {
        this.stats = stats;
        this.progresoSemanal = weekly;
        this.categoriasTrabajadas = categories;
        this.agendaData = agenda;
        this.secuenciasAsignadas = agenda.content;
        this.activityData = activity;
        this.actividadReciente = activity.content;

        setTimeout(() => {
          this.initWeeklyChart();
          this.initCategoryChart();
        }, 50);
      }
    });
  }

  loadAgenda(studentId: number): void {
    this.alumnosService.getStudentAgenda(studentId, this.agendaCurrentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          this.agendaData = res;
          this.secuenciasAsignadas = res.content;
        },
        error: (err) => {
          console.error('Error al cargar la agenda del alumno', err);
          this.agendaData = null as any;
          this.secuenciasAsignadas = [];
        }
      });
  }

  prevAgenda(): void {
    if (this.agendaCurrentPage > 0) {
      this.agendaCurrentPage--;
      this.loadAgenda(this.alumno().id);
    }
  }

  nextAgenda(): void {
    if (this.agendaData && this.agendaCurrentPage < this.agendaData.page.totalPages - 1) {
      this.agendaCurrentPage++;
      this.loadAgenda(this.alumno().id);
    }
  }

  loadActivity(studentId: number): void {
    this.alumnosService.getStudentActivity(studentId, this.actividadCurrentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          this.activityData = res;
          this.actividadReciente = res.content;
        },
        error: (err) => {
          console.error('Error al cargar la actividad reciente', err);
          this.activityData = null as any;
          this.actividadReciente = [];
        }
      });
  }

  prevActividad(): void {
    if (this.actividadCurrentPage > 0) {
      this.actividadCurrentPage--;
      this.loadActivity(this.alumno().id);
    }
  }

  nextActividad(): void {
    if (this.activityData && this.actividadCurrentPage < this.activityData.page.totalPages - 1) {
      this.actividadCurrentPage++;
      this.loadActivity(this.alumno().id);
    }
  }

  initWeeklyChart(): void {
    if (this.progresoSemanal.length === 0) {
      if (this.weeklyChart) {
        this.weeklyChart.destroy();
        this.weeklyChart = null;
      }
      return;
    }

    const ctxWeekly = document.getElementById('weeklyChart') as HTMLCanvasElement;
    if (!ctxWeekly) {
      setTimeout(() => this.initWeeklyChart(), 50);
      return;
    }

    if (this.weeklyChart) this.weeklyChart.destroy();

    this.weeklyChart = new Chart(ctxWeekly, {
      type: 'bar',
      data: {
        labels: this.progresoSemanal.map(d => d.date),
        datasets: [{
          label: 'Completadas',
          data: this.progresoSemanal.map(d => d.completed),
          backgroundColor: '#1f3c8b',
          borderRadius: 6,
          barPercentage: 0.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            border: { dash: [5, 5] },
            grid: { color: '#e2e8f0' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  initCategoryChart(): void {
    if (this.categoriasTrabajadas.length === 0) {
      if (this.categoryChart) {
        this.categoryChart.destroy();
        this.categoryChart = null;
      }
      return;
    }

    const ctxCategory = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!ctxCategory) {
      setTimeout(() => this.initCategoryChart(), 50);
      return;
    }

    if (this.categoryChart) this.categoryChart.destroy();

    this.categoryChart = new Chart(ctxCategory, {
      type: 'doughnut',
      data: {
        labels: this.categoriasTrabajadas.map(c => c.categoria),
        datasets: [{
          data: this.categoriasTrabajadas.map(c => c.porcentaje),
          backgroundColor: ['#1f3c8b', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right' } },
        cutout: '70%'
      }
    });
  }

  volver(): void {
    this.onClose.emit();
    this.router.navigate(['/students']);
  }

  getInitials(name?: string, lastName?: string): string {
    return `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }
}