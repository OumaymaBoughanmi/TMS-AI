export class CreateEscalationLogDto {
  incidentId: number;
  incidentTitle: string;
  severity: string;
  minutesOpen?: number;
  escalatedTo?: string;
}