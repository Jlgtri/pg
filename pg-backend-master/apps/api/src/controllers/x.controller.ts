import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { XService } from '../services/x.service';
import { WalletDTO } from '../dto/common.dto';

@ApiTags('x')
@Controller('x')
export class XController {
  @Inject() private xService: XService;

  @Get('check-participation')
  async checkParticipation(@Query() { wallet }: WalletDTO) {
    await this.xService.checkParticipation(wallet);
    return true;
  }
}
