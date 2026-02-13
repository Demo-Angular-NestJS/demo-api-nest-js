
import { Injectable } from '@nestjs/common';
import { BaseService } from 'common/services/base.service';
import { ToyRepository } from './toy.repository';
import { ToyResponseDTO } from './dto/toy-response.dto';
import { Toy } from './schemas/toy.schema';

@Injectable()
export class ToyService extends BaseService<Toy, ToyResponseDTO> {
  constructor(
    protected readonly toyRepository: ToyRepository,
  ) {
    super(toyRepository, ToyResponseDTO);
  }
}
