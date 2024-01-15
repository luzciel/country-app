import { Country } from "./country-interface";
import { Region } from "./region.type";

export interface CacheStore {
  byCapital: TermCountries;
  byCountry: TermCountries;
  byRegion:  TermRegion;
}

export interface TermCountries {
  term:      string;
  countries: Country[];
}

export interface TermRegion{
  region:      Region;
  countries: Country[]
}
