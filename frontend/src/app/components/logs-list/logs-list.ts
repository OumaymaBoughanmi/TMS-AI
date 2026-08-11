import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogsService, Log } from '../../services/logs';

@Component({
  selector: 'app-logs-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './logs-list.html',
  styleUrl: './logs-list.css'
})
export class LogsList implements OnInit {
  logs: Log[] = [];
  searchTerm = '';

  constructor(private logsService: LogsService) {}

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.logsService.getLogs(this.searchTerm).subscribe((data) => {
      this.logs = data;
    });
  }

  getLevelClass(level: string): string {
    return 'level-' + level.toLowerCase();
  }
}