/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';

import Web3 from 'web3';
import { SIGNATURE_LIFETIME_MS } from '@libs/constants';
import { isAddressesEqual } from './addresses.utils';

const localWeb3 = new Web3();

export const prepareHashMessage = (data: any) => {
  // @ts-ignore
  // eslint-disable-next-line prettier/prettier
  return Object.entries(data).sort(([a], [b]) => a - b).map(([key, val]) => `${key}_${val}`).join('__');
};

export const getSignerBySignature = (data: any, signature: string) => {
  const preparedHashData = prepareHashMessage(data);
  const msgHash = localWeb3.eth.accounts.hashMessage(preparedHashData);
  const signer = localWeb3.eth.accounts.recover(msgHash, signature, false);
  return signer;
};

export class SignatureService {
  async checkSignatureOrThrow(
    signature: string,
    message: any,
    timestamp: number,
    checkedAddress: string,
  ) {
    if (Date.now() / 1000 > timestamp + SIGNATURE_LIFETIME_MS) {
      throw new BadRequestException('signature is expired');
    }

    try {
      const signer = getSignerBySignature(message, signature);
      if (!isAddressesEqual(signer, checkedAddress)) {
        throw new UnprocessableEntityException(
          'Extracted address in not the same as provided address',
        );
      }
    } catch (error) {
      if (error instanceof UnprocessableEntityException) throw error;
      throw new BadRequestException('Failed to recover signer');
    }
  }
}
