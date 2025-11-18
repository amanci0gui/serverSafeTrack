import { Controller } from '@nestjs/common';
import { BairroService } from './bairro.service';

@Controller('bairro')
export class BairroController {
  constructor(private readonly bairroService: BairroService) {}
}
