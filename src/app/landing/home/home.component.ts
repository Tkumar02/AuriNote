import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { InvoiceService } from '../../services/invoice.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ProfileDetailsService } from '../../services/profile-details.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  totalAmount: number = 0;
  paidAmount: number = 0;
  userEmail: string = '';
  profile: any;
  isProfileIncomplete: boolean = false;

  constructor(private iservice:InvoiceService, private afAuth: AngularFireAuth, private pservice:ProfileDetailsService) {}

  ngOnInit(): void {
    this.getTotals();
    this.getCurrentUser();
  }

  async getCurrentUser() {
  const user = await this.afAuth.currentUser;
  if (user && user.email) {
    this.pservice.getProfileDetails(user.email).subscribe((val:any) => {
      this.profile = val[0];
      this.checkCompletion();
    });
  }
}

checkCompletion() {
  if (this.profile) {
    const hasName = !!this.profile.name && this.profile.name.trim().length > 0;
    const hasBank = !!this.profile.bankDetails && this.profile.bankDetails.length > 0;
    const hasClients = !!this.profile.clients && this.profile.clients.length > 0;

    // The banner ONLY disappears if ALL THREE are true
    // If ANY of these are missing, isProfileIncomplete stays TRUE
    this.isProfileIncomplete = !(hasName && hasBank && hasClients);
  } else {
    this.isProfileIncomplete = true;
  }
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
