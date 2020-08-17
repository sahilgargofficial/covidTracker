import {Component} from '@angular/core';
import {GlobalModel} from './model/global.model';
import {ApiService} from './api/api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    global: boolean;
    country: string;
    data: GlobalModel;
    dailyData: any[];
    countries: any[];
    lineChartData: any[] = [
        {
            data: [65, 64, 33, 44], label: 'Temp label'
        }
    ];
    lineChartType = 'line';
    lineChartLabels: any[] = [
        'Label01', 'Label02', 'Label03', 'Label04'
    ];
    barChartType = 'bar';
    barChartLabels: any[] = [
        'Infected', 'Recovered', 'Deaths'
    ];
    barChartData: any[] = [
        {data: [65, 76, 33], label: 'Lable'}
    ];


    constructor(private api: ApiService) {
        this.data = new GlobalModel();
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnInit(): void {
        this.global = true;
        this.fetchData();
        this.fetchCountries();
        this.fetchDailyData();
    }

    fetchData() {
        this.api.fetchData().subscribe((res: any) => {
            this.data.confirmed = res.confirmed.value;
            this.data.recovered = res.recovered.value;
            this.data.deaths = res.deaths.value;
            this.data.lastUpdate = res.lastUpdate;
        });
    }

    fetchCountries() {
        this.api.fetchCountries().subscribe((res: any) => {
            const countries = res.countries;
            this.countries = countries.map((name) => name.name);
        });
    }

    fetchDataByCountry(country: string) {
        this.api.fetchDataByCountry(country).subscribe((res: any) => {
            this.data.confirmed = res.confirmed.value;
            this.data.recovered = res.recovered.value;
            this.data.deaths = res.deaths.value;
            this.data.lastUpdate = res.lastUpdate;
            this.barChartData = [
                {
                    data: [this.data.confirmed, this.data.recovered, this.data.deaths],
                    label: 'People'
                }
            ];
        });
    }

    fetchDailyData() {
        // HOME page
        this.api.fetchDailyData().subscribe((res: any[]) => {
            this.lineChartLabels = res.map((date) => date.reportDate);
            const infectedData = res.map((confirmed) => confirmed.totalConfirmed);
            const death = res.map((deaths) => deaths.deaths.total);
            const incidentRate = res.map((recovered) => recovered.incidentRate);
            /* Incidence rate or “incidence” is numerically defined as the number of new cases of
             a disease within a time period, as a proportion of the number of people at risk for the
              disease.*/

            this.lineChartData = [
                {
                    data: infectedData,
                    label: 'Infected'
                },
                {
                    data: death,
                    label: 'Deaths'
                },
                {
                    data: incidentRate,
                    label: 'Incident Rate'
                }
            ];
        });
    }

    countryChanged(value: string) {
        this.country = value;
        if (value === 'global') {
            this.fetchData();
            this.global = true;
        } else {
            this.fetchDataByCountry(value);
            this.global = false;
        }
    }
}
