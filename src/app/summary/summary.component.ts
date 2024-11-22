import { Component } from '@angular/core';
import { InvoiceService } from '../services/invoice.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { InvoiceItem } from '../interfaces';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  userEmail = '';
  invoices: any;
  showBox: boolean = false;
  selectedInvoice: any;
  editInput: boolean = false;
  newPayment: number = 0;
  showNotes: boolean = false;
  childPDF: boolean = false;

  constructor(
    private iservice: InvoiceService, 
    private afAuth: AngularFireAuth,
    private toast: ToastrService,
  ) {}

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
      this.invoices.sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime());
    })
  }

  setSelectedInvoice(index: number) {
    this.selectedInvoice = this.invoices[index];
    console.log(this.editInput)
  }

  deleteInvoice(id:string){
    this.iservice.deleteInvoice(id).then(()=>{
      this.toast.success('Invoice successfully deleted')
    })
  }

  confirmFull(invoice:any){
    const updatedData = {
      final: invoice.total,
      paid: true
    }
    this.iservice.updateInvoice(invoice.id,updatedData).then(()=>{
      this.toast.success('Payment status submitted successfully')
    })
  }

  changePayment(){
    this.editInput = !this.editInput;
  }

  editPayment(id:string){
    const updatedData = {
      paid:true,
      final: this.newPayment
    }
    this.iservice.updateInvoice(id,updatedData).then(()=>{
      this.newPayment = 0;
      this.toast.success('New payment saved')
    })
    this.editInput = false;
    console.log(updatedData.final, this.editInput)
  }

  submitNotes(id:string,newNotes:string){
    console.log(id)
    const updatedData = {
      notes: newNotes
    }
    this.iservice.updateInvoice(id,updatedData).then(()=>{
      this.toast.success('Notes updated successfully');
      this.showNotes = false;
      console.log('done')
    })
  }

  generatePDF(index:number){
    this.selectedInvoice = this.invoices[index];
    this.childPDF = true;
    console.log(this.selectedInvoice.id)
  }
}
