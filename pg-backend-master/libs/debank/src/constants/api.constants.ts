import CONFIG from 'config';

export const HEADERS = {
  AccessKey: CONFIG.DEBANK_API_KEY,
  Accept: 'application/json',
};

export const API_URL = 'https://pro-openapi.debank.com/v1';
export const apiAllTokensListUrl = (address: string) =>
  `${API_URL}/user/all_token_list?id=${address}`;
