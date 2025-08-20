export interface Holder {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[];
  logo_url: string;
  address: string;
  balance: string;
  total_supply: string;
  block_height: number;
}

export interface Pagination {
  has_more: boolean;
  page_number: number;
  page_size: number;
  total_count: number;
}

export interface TokenHoldersResponse {
  updated_at: string;
  chain_id: number;
  chain_name: string;
  items: Holder[];
  pagination: Pagination;
}
