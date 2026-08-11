import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfrastructureService, InfrastructureCheck } from '../../services/infrastructure';

@Component({
  selector: 'app-infrastructure-status',
  imports: [CommonModule],
  templateUrl: './infrastructure-status.html',
  styleUrl: './infrastructure-status.css'
})
export class InfrastructureStatus implements OnInit {
  checks: InfrastructureCheck[] = [];

  constructor(private infraService: InfrastructureService) {}

  ngOnInit() {
    this.loadChecks();
  }

  loadChecks() {
    this.infraService.getChecks().subscribe((data) => {
      // Only show the latest check per unique "name"
      const latestByName = new Map<string, InfrastructureCheck>();
      for (const check of data) {
        if (!latestByName.has(check.name)) {
          latestByName.set(check.name, check);
        }
      }
      this.checks = Array.from(latestByName.values());
    });
  }
}