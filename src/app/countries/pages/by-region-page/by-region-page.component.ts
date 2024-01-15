import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country-interface';
import { Observable } from 'rxjs';
import { Region } from '../../interfaces/region.type';

@Component({
  selector: 'app-by-region-page',
  templateUrl: './by-region-page.component.html',
  styles: ``
})
export class ByRegionPageComponent implements OnInit {

  public countries: Country[] = [];
  public regions: Region[] = ["Oceania", "Americas", "Africa", "Europe", "Asia"];
  public selectedRegion?: Region;
  public isLoading: boolean = false;

constructor( private countriesService:CountriesService) {}

ngOnInit(): void {
  this.countries = this.countriesService.cacheStore.byRegion.countries;
  this.selectedRegion  = this.countriesService.cacheStore.byRegion.region;
}

searchByRegion( region: Region): void{

  this.isLoading = true;
  this.selectedRegion = region;

  this.countriesService.searchRegion( region ).subscribe((countries) => {
    this.countries = countries
    this.isLoading = false
  });
}
}
