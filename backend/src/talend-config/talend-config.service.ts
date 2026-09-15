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
}