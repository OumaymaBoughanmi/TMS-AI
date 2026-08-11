import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscalationLogsService, EscalationLog } from '../../services/escalation-logs';
import { IncidentsService, Incident } from '../../services/incidents';

@Component({
  selector: 'app-escalation-history',
  imports: [CommonModule],
  templateUrl: './escalation-history.html',
  styleUrl: './escalation-history.css'
})
export class EscalationHistory implements OnInit {
  escalationLogs: EscalationLog[] = [];
  incidents: Incident[] = [];

  constructor(
    private escalationLogsService: EscalationLogsService,
    private incidentsService: IncidentsService
  ) {}

  ngOnInit() {
    this.escalationLogsService.getLogs().subscribe((data) => {
      this.escalationLogs = data;
    });

    this.incidentsService.getIncidents().subscribe((data) => {
      this.incidents = data;
    });
  }

  getIncidentStatus(incidentId: number): string {
    const incident = this.incidents.find((i) => i.id === incidentId);
    return incident ? incident.status : 'UNKNOWN';
  }

  getSeverityClass(severity: string): string {
    return 'severity-' + severity.toLowerCase();
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase();
  }
}