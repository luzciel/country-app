import { TermRegion } from './../interfaces/cache-store.interface';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map, of, delay, tap } from "rxjs";

import { Country } from "../interfaces/country-interface";
import { CacheStore } from "../interfaces/cache-store.interface";
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: "root",
})
export class CountriesService {

  private apiUrl: string = "https://restcountries.com/v3.1";

  public cacheStore: CacheStore = {
    byCapital: { term: "", countries: [] },
    byCountry: { term: "", countries: [] },
    byRegion:  { region: "", countries: [] },
  }

  constructor(private http: HttpClient) {
    this.loadFromLocalStore();
  }

  private saveLocalStore(): void {
    localStorage.setItem("cacheStore", JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStore(): void {
    if(!localStorage.getItem("cacheStore")) return;

    this.cacheStore = JSON.parse(localStorage.getItem("cacheStore")!);
  }

  private getCountryRequest(url:string): Observable<Country[]>{
    return this.http.get<Country[]>( url )
      .pipe(
        catchError(() => of([]))
      );
  }
  searchCountryByAlphaCode( code: string): Observable<Country | null> {

    const url = `${this.apiUrl}/alpha/${code}`;

    return this.http.get<Country[]>(url)
    .pipe(
      map( (countries) => countries.length > 0 ? countries[0] : null),
      catchError(() => of(null))
    );
  }

  searchCapital( term: string): Observable<Country[]> {

    const url = `${this.apiUrl}/capital/${term}`;
    return this.getCountryRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byCapital = { term, countries }),
        tap(() => this.saveLocalStore())
      )
  }

  searchCountry( term:string ): Observable<Country[]> {

    const url = `${this.apiUrl}/name/${term}`;
    return this.getCountryRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byCountry = { term, countries }),
        tap(() => this.saveLocalStore())
      )
  }

  searchRegion( region: Region): Observable<Country[]> {

    const url= `${this.apiUrl}/region/${region}`;
    return this.getCountryRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byRegion = { region, countries }),
        tap(() => this.saveLocalStore())
      )
  }
}
