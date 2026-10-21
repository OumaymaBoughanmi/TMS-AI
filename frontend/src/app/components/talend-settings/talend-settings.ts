import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TalendConfigService, TestResult } from '../../services/talend-config';

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
  isTesting = false;
  testResult: TestResult | null = null;

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

  testConnection() {
    this.testResult = null;
    this.isTesting = true;

    this.talendConfigService.testConnection({ apiUrl: this.apiUrl, apiToken: this.apiToken }).subscribe({
      next: (result) => {
        this.testResult = result;
        this.isTesting = false;
      },
      error: () => {
        this.testResult = { ok: false, message: "Impossible de lancer le test (êtes-vous connecté en tant qu'admin ?)." };
        this.isTesting = false;
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