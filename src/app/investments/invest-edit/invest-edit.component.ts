
import { Component, signal, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FidelityService } from '../../services/fidelity.service';
import { InvestmentsService } from '../../services/investments.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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

  url: string = '';
  priceResult: any;
  userEmail: string = '';
  allInvestments: any;
  showSummary: boolean = false;

  constructor(
    private fidelityService: FidelityService,
    private http: HttpClient,
    private iService: InvestmentsService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    this.getCurrentUserEmail()
  }

  investSummary() {
    this.showSummary = true;
    this.showInvests()
  }

  async getCurrentUserEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userEmail = user.email!;
    }
    console.log(this.userEmail)
  }

  fetchInvestPrice() {
    if (!this.url) return;
    this.fidelityService.getPrice(this.url).subscribe({
      next: (res) => {
        this.priceResult = res.price;
        console.log(res);
      },
      error: (err) => {
        console.error(err);
        this.priceResult = 'Error fetching price';
      }
    });
  }

  showInvests() {
    this.iService.viewInvestments(this.userEmail).subscribe(val => {
      this.allInvestments = val;
    })
  }

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
