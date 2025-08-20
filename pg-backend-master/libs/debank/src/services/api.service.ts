import axios from 'axios';
import { apiAllTokensListUrl, HEADERS } from '../constants/api.constants';
import { Logger } from '@nestjs/common';
import { TokensListResponse } from '../types/dabant.types';

export class DebankApiService {
  #logger = new Logger(DebankApiService.name);

  async getAllTokensList(
    address: string,
  ): Promise<TokensListResponse[] | null> {
    try {
      const url = apiAllTokensListUrl(address);
      const response = await axios.get<TokensListResponse[]>(url, {
        headers: HEADERS,
      });
      if (response.statusText !== 'OK') {
        throw new Error(`Response error: ${response}`);
      }
      return response.data;
    } catch (error) {
      this.#logger.error('Error on getTotalBalance', { error });
      return null;
    }
  }
}
