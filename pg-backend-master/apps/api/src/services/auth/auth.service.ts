import {
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SignatureService, toLower } from 'libs/utils/src';
import { DataSource } from 'typeorm';
import { UserEntity } from '@libs/db';
import { SignatureBodyDTO } from '../../dto/common.dto';

@Injectable()
export class AuthService {
  @Inject() private signatureService: SignatureService;
  @Inject() private dataSource: DataSource;

  private logger = new Logger(AuthService.name);

  async checkSignature(params: SignatureBodyDTO) {
    const { xUserName, data, signature } = params;
    const user = await this.dataSource.manager.findOneBy(UserEntity, {
      xUserName,
    });
    if (user) {
      throw new UnprocessableEntityException('User exists');
    }
    await this.signatureService.checkSignatureOrThrow(
      params.signature,
      params.data,
      params.data.timestamp,
      params.data.wallet,
    );
    await this.dataSource.manager.save(UserEntity, {
      walletAddress: toLower(data.wallet),
      xUserName,
      registrationSignature: signature,
    });
  }
}
