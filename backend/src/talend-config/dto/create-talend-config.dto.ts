import { IsNotEmpty } from 'class-validator';

export class CreateTalendConfigDto {
  @IsNotEmpty()
  apiUrl: string;

  @IsNotEmpty()
  apiToken: string;
}