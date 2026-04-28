import { Component, input, output, signal, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  ){}

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

    this.alumnosService.getStudentStats(studentId).subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });

    this.alumnosService.getWeeklyProgress(studentId).subscribe(data => {
      this.progresoSemanal = data;
      setTimeout(() => this.initWeeklyChart(), 50);
    });

    this.alumnosService.getCategoryStats(studentId).subscribe(data => {
      this.categoriasTrabajadas = data;
      setTimeout(() => this.initCategoryChart(), 50);
    });

    this.agendaCurrentPage = 0;
    this.actividadCurrentPage = 0;
    this.loadAgenda(studentId);
    this.loadActivity(studentId);
  }

  loadAgenda(studentId: number): void {
    this.alumnosService.getStudentAgenda(studentId, this.agendaCurrentPage, this.pageSize)
      .subscribe(res => {
        this.agendaData = res;
        this.secuenciasAsignadas = res.content;
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
      .subscribe(res => {
        this.activityData = res;
        this.actividadReciente = res.content;
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