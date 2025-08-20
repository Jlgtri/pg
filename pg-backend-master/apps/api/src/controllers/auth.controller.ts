import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignatureBodyDTO } from '../dto/common.dto';
import { AuthService } from '../services';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Inject() private authService: AuthService;

  @Post('signature')
  async checkSignature(@Body() data: SignatureBodyDTO) {
    await this.authService.checkSignature(data);
    return true;
  }
}
