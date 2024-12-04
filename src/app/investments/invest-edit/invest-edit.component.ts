import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-invest-edit',
  templateUrl: './invest-edit.component.html',
  styleUrl: './invest-edit.component.css'
})

export class InvestEditComponent {

  apiKey: string = 'DFJ69DIBB050YDRG';
  isin: string = '';
  prices: any[] = [];
  date: string = ''

  constructor(
    private http: HttpClient
  ){}

  fetchPrices(){
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.isin}&apikey=${this.apiKey}`

    this.http.get<any>(url).subscribe(
      (data) => {
        this.processPrices(data);
      },
      (error) => {
        console.error('Error fetching data:', error)
      }
    )
  }

  processPrices(data:any){
    const timeSeries = data['Time Series (Daily)'];

    if(!timeSeries) {
      console.error('No data found for this ISIN')
      return;
    }

    let prices = [];
    for (let date in timeSeries) {
      if (timeSeries.hasOwnProperty(date)) {
        prices.push({
          date:date,
          price: timeSeries[date]['4. close']
        })
      }
    }
    prices = prices.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0,7)
    this.prices = prices;
    console.log(this.prices)
  }
}
