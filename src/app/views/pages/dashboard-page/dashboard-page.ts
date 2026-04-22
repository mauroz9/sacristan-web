import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../logic/services/dashboard-service';
import { DailyExpectedSequencesDto, LatestReproductionsDto, MostUsedSequencesDto } from '../../../logic/interfaces/dashboard-interface';
@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit {

  constructor(private dashboardService: DashboardService) { }

  stats = {
    totalSequences: null as number | null,
    activeStudents: null as number | null,
    teachers: null as number | null,
    completedSequences: null as number | null,
    avgPerStudent: null as number | null,
  };

  topSequences: MostUsedSequencesDto[] = [];
  recentActivity: LatestReproductionsDto[] = [];
  weeklyActivity: DailyExpectedSequencesDto[] = [];

  chartMax = 1;

  barHeight(value: number): string {
    return `${(value / this.chartMax) * 100}%`;
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  timeAgo(dateStr: string): string {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'Hace un momento';
    if (diff < 60) return `Hace ${diff} min`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `Hace ${hours} h`;
    return `Hace ${Math.floor(hours / 24)} días`;
  }

  dayLabel(dateStr: string): string {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[new Date(dateStr).getDay()];
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 6);

    const toStr = today.toISOString().split('T')[0];
    const fromStr = weekAgo.toISOString().split('T')[0];

    this.dashboardService.countTotalSequences()
      .subscribe(total => this.stats.totalSequences = total);

    this.dashboardService.countTotalStudents()
      .subscribe(total => this.stats.activeStudents = total);

    this.dashboardService.countTotalTeachers()
      .subscribe(total => this.stats.teachers = total);

    this.dashboardService.countCompletedSequencesToday()
      .subscribe(total => this.stats.completedSequences = total);

    this.dashboardService.averageCompletedSequencesPerStudentToday()
      .subscribe(total => this.stats.avgPerStudent = total);

    this.dashboardService.getMostUsedSequences().subscribe(res => {
      this.topSequences = res.content.map((seq) => ({
        id: seq.id,
        title: seq.title,
        reproductions: seq.reproductions,
      }));
    });

    this.dashboardService.getLatestReproductions().subscribe(res => {
      this.recentActivity = res.content.map(rep => ({
        studentName: rep.studentName,
        sequenceTitle: rep.sequenceTitle,
        endedAt: this.timeAgo(rep.endedAt),
      }));
    });

    this.dashboardService.getDailyExpectedAndCompleted(fromStr, toStr).subscribe(data => {
      this.weeklyActivity = data.map(d => ({
        date: this.dayLabel(d.date),
        completed: d.completed,
        expected: d.expected,
      }));
      const dataMax = Math.max(...data.flatMap(d => [d.expected, d.completed]), 1);
      this.chartMax = Math.ceil(dataMax / 10) * 10;
    });
  }
}