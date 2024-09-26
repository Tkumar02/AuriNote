import { Component } from '@angular/core';
import { InvoiceService } from '../services/invoice.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  userEmail = '';
  invoices: any;
  showBox: boolean = false;
  editPayment: string = 'Confirm new Payment'

  constructor(private iservice: InvoiceService, private afAuth: AngularFireAuth) {}

  async getCurrentUserEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userEmail = user.email!;
    }
  }

  ngOnInit(): void {
    this.getCurrentUserEmail()
  }

  viewInvoices(){
    this.iservice.getUserInvoices(this.userEmail).subscribe(val=>{
      this.invoices = val
      if(this.invoices.length<1){
        this.showBox = true
      }
    })
  }

  paymentStatus(i:number){
    this.invoices[i].paid = !this.invoices[i].paid;
    if(this.invoices[i].paid){
      this.invoices[i].final = this.invoices[i].total
    }
    else{
      this.invoices[i].final = this.invoices[i].partialPayment
    }
    console.log(this.invoices[i].final,'total', this.invoices[i].total)
  }

  updateInvoice(invoice: any) {
    const updatedData = {
      notes: invoice.notes,  
      final: invoice.paid ? invoice.total : invoice.partialPayment
    };

    this.iservice.updateInvoice(invoice.id, updatedData).then(() => {
      console.log(`Invoice ${invoice.id} updated successfully!`);
    }).catch(error => {
      console.error("Error updating invoice: ", error);
    });
  }
}
