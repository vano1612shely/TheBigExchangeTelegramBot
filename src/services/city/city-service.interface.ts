export interface ICity {
  id: number;
  country: string;
  city_name: string;
}

export interface ICityByCountry {
  [country: string]: {
    id: number;
    country: string;
    city_name: string;
  }[];
}
