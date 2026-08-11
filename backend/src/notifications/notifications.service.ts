import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_APP_PASSWORD'),
      },
    });
  }

  async sendIncidentAlert(incident: {
    title: string;
    severity: string;
    source: string;
    probableCause?: string;
    description?: string;
  }) {
    const toEmail = this.configService.get('EMAIL_TO');

    try {
      await this.transporter.sendMail({
        from: `"TMS AI Monitoring" <${this.configService.get('EMAIL_USER')}>`,
        to: toEmail,
        subject: `🚨 Incident Alert: ${incident.title}`,
        html: `
          <h2>New Incident Detected</h2>
          <p><strong>Title:</strong> ${incident.title}</p>
          <p><strong>Source:</strong> ${incident.source}</p>
          <p><strong>Severity:</strong> ${incident.severity}</p>
          <p><strong>Probable Cause:</strong> ${incident.probableCause || 'Not determined'}</p>
          <p><strong>Description:</strong> ${incident.description || 'N/A'}</p>
          <hr>
          <p style="color: #888; font-size: 12px;">Sent automatically by TMS AI Monitoring System</p>
        `,
      });
      console.log('Incident alert email sent successfully');
    } catch (error) {
      console.error('Failed to send incident alert email:', error.message);
    }
  }

  async sendEscalationAlert(incident: {
    title: string;
    severity: string;
    minutesOpen: number;
  }) {
    const toEmail = this.configService.get('EMAIL_TO');

    try {
      await this.transporter.sendMail({
        from: `"TMS AI Monitoring" <${this.configService.get('EMAIL_USER')}>`,
        to: toEmail,
        subject: `⚠️ ESCALATION: ${incident.title} — still unresolved`,
        html: `
          <h2 style="color: #D93025;">Incident Escalated</h2>
          <p><strong>Title:</strong> ${incident.title}</p>
          <p><strong>Severity:</strong> ${incident.severity}</p>
          <p><strong>Open for:</strong> ${incident.minutesOpen} minutes</p>
          <p>This incident has not been resolved in time and requires urgent attention.</p>
          <hr>
          <p style="color: #888; font-size: 12px;">Sent automatically by TMS AI Monitoring System</p>
        `,
      });
      console.log('Escalation alert email sent successfully');
    } catch (error) {
      console.error('Failed to send escalation alert email:', error.message);
    }
  }
}