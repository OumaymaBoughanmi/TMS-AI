import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobsService, Job } from '../../services/jobs';
import { InfrastructureStatus } from '../infrastructure-status/infrastructure-status';
import { DashboardOverview } from '../dashboard-overview/dashboard-overview';

@Component({
  selector: 'app-jobs-list',
  imports: [CommonModule, FormsModule, InfrastructureStatus, DashboardOverview],
  templateUrl: './jobs-list.html',
  styleUrl: './jobs-list.css'
})
export class JobsList implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  searchTerm = '';

  constructor(private jobsService: JobsService) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.jobsService.getJobs().subscribe((data) => {
      this.jobs = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredJobs = this.jobs;
      return;
    }

    this.filteredJobs = this.jobs.filter(
      (job) =>
        job.name.toLowerCase().includes(term) ||
        (job.server || '').toLowerCase().includes(term) ||
        job.status.toLowerCase().includes(term)
    );
  }

  getStatusClass(status: string): string {
    if (status === 'SUCCESS') return 'status-success';
    if (status === 'FAILED') return 'status-failed';
    return 'status-running';
  }

  countByStatus(status: string): number {
    return this.jobs.filter(j => j.status === status).length;
  }
}