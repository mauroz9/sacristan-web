import { Component, input, output, signal, SimpleChanges, OnInit, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignedSequenceProgressDTO, CategoryStatDTO, DailyProgressDTO, RecentActivityDTO, StudentDashboardResponse, StudentStatsDTO } from '../../../logic/interfaces/alumnos-interface';
import { AlumnosService } from '../../../logic/services/alumnos-service';
import { LoadingComponent } from '../shared/loading-component/loading-component';
import Chart from 'chart.js/auto';

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
  isLoading = signal<boolean>(true);
  chartMax = 20;
  weeklyChart: any;
  categoryChart: any;

  stats: StudentStatsDTO = {
    secuenciasCompletadas: 0, secuenciasEnProgreso: 0, tasaExito: 0,
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
    this.alumnosService.getStudentDashboard(studentId).subscribe({
      next: (data: StudentDashboardResponse) => {
        this.stats = data.stats;
        this.progresoSemanal = data.progresoSemanal;
        this.categoriasTrabajadas = data.categoriasTrabajadas;
        this.secuenciasAsignadas = data.secuenciasAsignadas;
        this.actividadReciente = data.actividadReciente;
      
        this.isLoading.set(false);
        setTimeout(() => this.initCharts(), 50);
      },
      error: (error) => {
        console.error('Error al cargar analíticas', error);
        this.isLoading.set(false);
      }
    });
  }

  initCharts(): void {
    const ctxWeekly = document.getElementById('weeklyChart') as HTMLCanvasElement;
    const ctxCategory = document.getElementById('categoryChart') as HTMLCanvasElement;

    if (!ctxWeekly || !ctxCategory) {
        setTimeout(() => this.initCharts(), 50);
        return;
    }

    if (this.weeklyChart) this.weeklyChart.destroy();
    if (this.categoryChart) this.categoryChart.destroy();
    
    // 1. Gráfico Semanal
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