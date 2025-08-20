export const API_URL_V1 = 'https://api.covalenthq.com/v1/';

export const getApiUrlTokenHolders = (
  chainName: string,
  tokenAddress: string,
) => API_URL_V1 + `${chainName}/tokens/${tokenAddress}/token_holders_v2/`;
