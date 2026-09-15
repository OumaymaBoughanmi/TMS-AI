import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TalendConfigService } from '../../services/talend-config';

@Component({
  selector: 'app-talend-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './talend-settings.html',
  styleUrl: './talend-settings.css'
})
export class TalendSettings implements OnInit {
  apiUrl = '';
  apiToken = '';
  isConfigured = false;
  successMessage = '';
  errorMessage = '';

  constructor(private talendConfigService: TalendConfigService) {}

  ngOnInit() {
    this.loadConfig();
  }

  loadConfig() {
    this.talendConfigService.getConfig().subscribe({
      next: (config) => {
        if (config) {
          this.apiUrl = config.apiUrl;
          this.apiToken = config.apiToken;
          this.isConfigured = true;
        }
      },
      error: () => {
        this.isConfigured = false;
      }
    });
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    this.talendConfigService.saveConfig({ apiUrl: this.apiUrl, apiToken: this.apiToken }).subscribe({
      next: () => {
        this.successMessage = 'Configuration Talend enregistrée avec succès.';
        this.isConfigured = true;
      },
      error: () => {
        this.errorMessage = "Erreur lors de l'enregistrement de la configuration.";
      }
    });
  }
}