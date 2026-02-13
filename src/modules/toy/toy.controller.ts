import { Controller } from '@nestjs/common';
import { BaseController } from 'modules/base.controller';
import { Toy } from './schemas/toy.schema';
import { CreateToyDTO } from './dto/create-toy.dto';
import { UpdateToyDTO } from './dto/update-toy.dto';
import { ToyResponseDTO } from './dto/toy-response.dto';
import { ToyService } from './toy.service';

@Controller('toy')
export class ToyController extends BaseController<Toy, CreateToyDTO, UpdateToyDTO, ToyResponseDTO> {
  constructor(
    private readonly toyService: ToyService,
  ) {
    super(toyService, ToyResponseDTO);
  }
}
