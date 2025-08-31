export interface Country {
  id: number;
  title: string;
  code: string;
  symbol: string;
  flag: string;
}

export interface CountriesResponse {
  data: {
    data: Country[];
    next_page_url: string | null;
  };
  message: string;
  code: number;
}
