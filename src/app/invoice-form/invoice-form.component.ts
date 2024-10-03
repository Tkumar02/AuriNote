import { Component } from '@angular/core';
import { InvoiceService } from '../services/invoice.service';
import { ProfileDetailsService } from '../services/profile-details.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.css'
})
export class InvoiceFormComponent {
  clientName: string = '';
  invoiceNumber: string = '';
  userEmail: string = '';
  date = new Date;
  dateDue= new Date;
  notes = '';
  items = [{ description:'', quantity:0, price:0}];
  total = 0;
  details: any;
  selectedBusiness: string = '';
  selectedAddress: string = '';
  selectedBank: string = '';

  constructor(
    private invoiceService:InvoiceService, 
    private afAuth: AngularFireAuth,
    private pService: ProfileDetailsService
  ) {}

  ngOnInit(): void{
    this.getCurrentUserEmail();
    this.dateDue.setDate(this.date.getDate() + 14)
  }

  calculateTotal() {
    this.total = this.items.reduce((sum,item) => sum + item.quantity * item.price,0)
  }

  addItem() {
    this.items.push({description: '', quantity:0, price:0})
  }

  submitInvoice() {
    const invoice = {
      userEmail:this.userEmail, 
      clientName: this.clientName, 
      date: this.date, 
      items: this.items, 
      total: this.total,
      partialPayment:0, 
      paid:false, 
      final: 0,
      notes:this.notes,
      invoiceID:this.invoiceNumber};
    this.invoiceService.createInvoice(invoice).then(()=> {
      console.log('invoice created successfully')
    })
  }

  async getCurrentUserEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userEmail = user.email!;
    }
    this.pService.getProfileDetails(this.userEmail).subscribe(val=>{
      this.details = val[0];
      console.log(this.details)
    })
  }
}
