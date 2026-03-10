import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics-page',
  imports: [CommonModule],
  templateUrl: './statistics-page.html',
  styleUrl: './statistics-page.css',
})
export class StatisticsPage {

  stats = {
    totalSequences: 47,
    activeStudents: 128,
    teachers: 15,
    completedSequences: 89,
    avgPerStudent: 6.8,
  };

  topSequences = [
    { rank: 1, name: 'Calmarse',         totalUses: 156, trend: '+12%' },
    { rank: 2, name: 'Ducharse',          totalUses: 143, trend: '+8%'  },
    { rank: 3, name: 'Ir al baño',        totalUses: 128, trend: '+5%'  },
    { rank: 4, name: 'Comer / Merendar',  totalUses: 119, trend: '+15%' },
    { rank: 5, name: 'Entrar en clase',   totalUses: 98,  trend: '+3%'  },
  ];

  recentActivity = [
    { initials: 'MG', name: 'María García',  sequence: 'Calmarse',        timeAgo: 'Hace 5 min',  status: 'completada'  },
    { initials: 'JP', name: 'Juan Pérez',    sequence: 'Ducharse',         timeAgo: 'Hace 12 min', status: 'completada'  },
    { initials: 'CR', name: 'Carlos Ruiz',   sequence: 'Entrar en clase',  timeAgo: 'Hace 25 min', status: 'completada'  },
    { initials: 'SM', name: 'Sofía Martín',  sequence: 'Ir al baño',       timeAgo: 'Hace 32 min', status: 'completada'  },
  ];

  weeklyActivity = [
    { day: 'Lun', completed: 43, started: 43 },
    { day: 'Mar', completed: 65, started: 65 },
    { day: 'Mié', completed: 89, started: 94 },
    { day: 'Jue', completed: 45, started: 45 },
    { day: 'Vie', completed: 55, started: 57 },
    { day: 'Sáb', completed: 24, started: 24 },
    { day: 'Dom', completed: 15, started: 15 },
  ];

  readonly chartMax = 100;

  barHeight(value: number): string {
    return `${(value / this.chartMax) * 100}%`;
  }
}
