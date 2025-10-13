export interface Country {
  id: number;
  title: string;
  code: string;
  symbol: string;
  flag: string;
  center_lat: number;
  center_lng: number;
}

export interface CountriesResponse {
  data: {
    data: Country[];
    next_page_url: string | null;
  };
  message: string;
  code: number;
}
