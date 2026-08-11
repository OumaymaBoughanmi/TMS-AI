import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentsService, Incident, IncidentStatus } from '../../services/incidents';
import { EscalationLogsService, EscalationLog } from '../../services/escalation-logs';

@Component({
  selector: 'app-incidents-list',
  imports: [CommonModule],
  templateUrl: './incidents-list.html',
  styleUrl: './incidents-list.css'
})
export class IncidentsList implements OnInit {
  incidents: Incident[] = [];
  escalationLogs: EscalationLog[] = [];

  constructor(
    private incidentsService: IncidentsService,
    private escalationLogsService: EscalationLogsService
  ) {}

  ngOnInit() {
    this.loadIncidents();
    this.loadEscalationLogs();
  }

  loadIncidents() {
    this.incidentsService.getIncidents().subscribe((data) => {
      this.incidents = data;
    });
  }

  loadEscalationLogs() {
    this.escalationLogsService.getLogs().subscribe((data) => {
      this.escalationLogs = data;
    });
  }

  resolve(id: number) {
    this.incidentsService.updateStatus(id, IncidentStatus.RESOLVED).subscribe(() => {
      this.loadIncidents();
    });
  }

  getSeverityClass(severity: string): string {
    return 'severity-' + severity.toLowerCase();
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase();
  }

  getIncidentStatus(incidentId: number): string {
    const incident = this.incidents.find((i) => i.id === incidentId);
    return incident ? incident.status : 'UNKNOWN';
  }

  expandedIncidentId: number | null = null;

  toggleExpand(id: number) {
    this.expandedIncidentId = this.expandedIncidentId === id ? null : id;
  }

  relatedLogs: { [incidentId: number]: any[] } = {};
  showingLogsFor: number | null = null;

  toggleLogs(id: number) {
    if (this.showingLogsFor === id) {
      this.showingLogsFor = null;
      return;
    }

    this.showingLogsFor = id;

    if (!this.relatedLogs[id]) {
      this.incidentsService.getRelatedLogs(id).subscribe((logs) => {
        this.relatedLogs[id] = logs;
      });
    }
  }
}