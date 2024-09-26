import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { InvoiceService } from '../../services/invoice.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  totalAmount: number = 0;
  paidAmount: number = 0;
  userEmail: string = '';

  constructor(private iservice:InvoiceService, private afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.getTotals();
  }

  // Function to calculate the total amount of all invoices
  calculateInvoiceTotal() {
    this.iservice.getUserInvoices(this.userEmail)
      .pipe(
        map((invoices: any[]) => {
          // Sum the total of all invoices
          return invoices.reduce((acc, invoice) => acc + invoice.total, 0);
        })
      )
      .subscribe(total => {
        this.totalAmount = total;
      });
  }

  calculatePaidTotal(){
    this.iservice.getUserInvoices(this.userEmail)
      .pipe(
        map((invoices: any[]) => {
          // Sum the total of all invoices
          return invoices.reduce((acc, invoice) => acc + invoice.final, 0);
        })
      )
      .subscribe(total => {
        this.paidAmount = total;
      });
  }

  async getTotals() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userEmail = user.email!;
      this.calculatePaidTotal()
      this.calculateInvoiceTotal()
    }
  }

}
