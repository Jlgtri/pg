/* eslint-disable prettier/prettier */
import CONFIG from 'config';
import { Logger } from '@nestjs/common';
import { TokenHoldersResponse } from '../types/token-holders.types';
import axios from 'axios';
import { getApiUrlTokenHolders } from '../constants/api.constants';

export class ApiService {
  private logger = new Logger(ApiService.name);

  async getTokenHolders(
    tokenAddress: string,
    chainName: string,
    params?: {
      pageNumber?: number,
      date?: string,
    }
  ): Promise<TokenHoldersResponse | null> {
    try {
      const response = await axios.get(getApiUrlTokenHolders(chainName, tokenAddress),
        {
          headers: { Authorization: `Bearer ${CONFIG.GOLDRUSH.KEY}` },
          params: {
            'page-size': 100,
            ...((params && params.pageNumber) ? { 'page-number': params.pageNumber } : {}),
            ...((params && params.date) ? { date: params.date } : {}),
          }
        });

      if (response.statusText !== 'OK') {
        throw new Error(`Response error: ${response}`);
      }
      return response.data.data;
    } catch (error) {
      console.log(error);
      this.logger.error('Error on getTokenHolders', { error, tokenAddress, chainName, params });
      return null;
    }
  }
}
