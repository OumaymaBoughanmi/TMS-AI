import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats, IncidentsOverTimePoint } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard-overview',
  imports: [CommonModule],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.css'
})
export class DashboardOverview implements OnInit {
  stats: DashboardStats | null = null;
  chartData: IncidentsOverTimePoint[] = [];
  maxCount = 1;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getStats().subscribe((data) => {
      this.stats = data;
    });

    this.dashboardService.getIncidentsOverTime().subscribe((data) => {
      this.chartData = data;
      this.maxCount = Math.max(...data.map((d) => d.count), 1);
    });
  }

  getBarHeight(count: number): number {
    return Math.round((count / this.maxCount) * 100);
  }

  formatDay(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
}