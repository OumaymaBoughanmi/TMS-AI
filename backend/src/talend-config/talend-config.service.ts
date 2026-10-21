import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTalendConfigDto } from './dto/create-talend-config.dto';
import { TalendConfig } from './entities/talend-config.entity';

@Injectable()
export class TalendConfigService {
  constructor(
    @InjectRepository(TalendConfig)
    private configRepository: Repository<TalendConfig>,
  ) {}

  // Returns the current active config (there should only be one)
  async getActiveConfig(): Promise<TalendConfig | null> {
    return this.configRepository.findOne({ where: { isActive: true } });
  }

  // Creates or updates the single config
  async saveConfig(dto: CreateTalendConfigDto): Promise<TalendConfig> {
    const existing = await this.getActiveConfig();

    if (existing) {
      existing.apiUrl = dto.apiUrl;
      existing.apiToken = dto.apiToken;
      return this.configRepository.save(existing);
    }

    const config = this.configRepository.create({
      apiUrl: dto.apiUrl,
      apiToken: dto.apiToken,
      isActive: true,
    });
    return this.configRepository.save(config);
  }

  // Tries the given URL + token against Talend, without saving anything
  async testConnection(dto: CreateTalendConfigDto): Promise<{ ok: boolean; message: string }> {
    let url: URL;
    try {
      url = new URL(dto.apiUrl.replace(/\/+$/, '') + '/executables/tasks');
    } catch {
      return { ok: false, message: "L'URL n'est pas valide." };
    }

    if (url.protocol !== 'https:') {
      return { ok: false, message: "L'URL doit commencer par https://" };
    }

    try {
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${dto.apiToken}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        return { ok: true, message: 'Connexion réussie : Talend a accepté cette URL et ce token.' };
      }
      if (response.status === 401) {
        return { ok: false, message: 'Token refusé (401) : il est invalide ou expiré.' };
      }
      if (response.status === 403) {
        return { ok: false, message: "Accès refusé (403) : Talend reconnaît la demande mais refuse l'accès (droits insuffisants ou compte inactif)." };
      }
      if (response.status === 404) {
        return { ok: false, message: "Adresse introuvable (404) : vérifiez l'URL et la région." };
      }
      return { ok: false, message: `Talend a répondu avec l'erreur ${response.status}.` };
    } catch {
      return { ok: false, message: "Impossible de joindre Talend (adresse incorrecte, pas d'Internet, ou délai dépassé)." };
    }
  }
}