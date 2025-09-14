
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  show: boolean = false;

  constructor(
    //private http: HttpClient
  ) { }

  //gemini code

  private http = inject(HttpClient);

  // Signals for state management
  searchTerm = signal('');
  result = signal<any | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSearch() {
    this.errorMessage.set(null);
    this.result.set(null);

    const term = this.searchTerm().trim();
    if (!term) {
      this.errorMessage.set('Please enter a search term.');
      return;
    }

    this.isLoading.set(true);

    // Make a POST request to the Python API
    this.http.post<any>('http://localhost:5001/api/findInvest', { search_term: term })
      .subscribe({
        next: (response) => {
          this.result.set(response);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.error || 'An unexpected error occurred. Check the Python console for details.');
          this.result.set(null);
          this.isLoading.set(false);
        }
      });
  }

  //code ends


  fetchPrices() {
    this.show = true
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

  processPrices(data: any) {
    const timeSeries = data['Time Series (Daily)'];

    if (!timeSeries) {
      console.error('No data found for this ISIN')
      return;
    }

    let prices = [];
    for (let date in timeSeries) {
      if (timeSeries.hasOwnProperty(date)) {
        prices.push({
          date: date,
          price: timeSeries[date]['4. close']
        })
      }
    }
    prices = prices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 7)
    this.prices = prices;
    console.log(this.prices)
  }
}
