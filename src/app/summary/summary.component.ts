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
  showDatebox: boolean = false;
  dateBox: boolean = false;
  startDate: any;
  endDate: any;
  allInvoices: any[]=[]
  businessOptions: any[]=[];
  selectedBusiness: string = '';
  message: string = 'Summary'
  totalSum: number = 0
  invoiceTotal: number = 0

  constructor(
    private iservice: InvoiceService,
    private afAuth: AngularFireAuth,
    private toast: ToastrService,
    private afs: AngularFireAuth,
  ) { }

  async getCurrentUserEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userEmail = user.email!;
    }
  }

  ngOnInit(): void {
    this.getCurrentUserEmail()
  }

viewInvoices() {
  this.showDatebox = false;
  this.iservice.getUserInvoices(this.userEmail).subscribe(val => {
    this.invoices = val;
    
    // 1. Calculate the total sum of all invoices
    this.totalSum = this.invoices.reduce((sum: number, invoice: any) => {
      return sum + (invoice.total || 0); // Added || 0 as a safety check
    }, 0);

    // 2. Update the invoice count
    this.invoiceTotal = this.invoices.length;

    if (this.invoices.length < 1) {
      this.showBox = true;
    }
    
    // Sort by date (newest first)
    this.invoices.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
}

retrieveInvoices(startDate: any, endDate: any) {
  // 1. Validation: Ensure dates exist and are in the right order
  if (!startDate || !endDate) {
    this.toast.warning("Please select both a start and end date.");
    this.invoices = [];
    this.dateBox = true;
    this.message = "Please select a date range";
    return;
  }

  if (new Date(startDate) > new Date(endDate)) {
    this.toast.error("The start date cannot be after the end date.");
    this.invoices = [];
    this.totalSum = 0;
    this.invoiceTotal = 0;
    this.dateBox = true;
    return;
  }

  // 2. Execution: If we got here, dates are valid!
  this.dateBox = false;
  this.message = 'Summary';

  this.iservice.getUserInvoices(this.userEmail).subscribe(val => {
    this.allInvoices = val;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the full end day

    // 3. Filter by Date AND Business
    this.invoices = this.allInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoiceDate.getTime() >= start.getTime() && 
             invoiceDate.getTime() <= end.getTime() &&
             invoice.businessName === this.selectedBusiness;
    });

    // 4. Update UI States
    this.dateBox = this.invoices.length < 1;
    this.invoiceTotal = this.invoices.length;
    
    // 5. Calculate Totals
    this.totalSum = this.invoices.reduce((sum: number, invoice: any) => {
      return sum + (invoice.total || 0);
    }, 0);

    // 6. Sort by Newest
    this.invoices.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
}


  viewSelectedInvoices() {
    this.showDatebox = true;
    this.showBox = false;
    this.iservice.getUserInvoices(this.userEmail).subscribe(val => {
        this.allInvoices = val;
        console.log(this.allInvoices)
        this.businessOptions = this.allInvoices.filter(
          invoice => invoice.businessName == this.selectedBusiness
        )
        console.log(this.businessOptions)
        const businessNames = this.allInvoices.map(invoice => invoice.businessName);

        // Step 2: Remove duplicates by converting the array to a Set and back to an array
        this.businessOptions = Array.from(new Set(businessNames));
      }
    )
  }

  setSelectedInvoice(index: number) {
    this.selectedInvoice = this.invoices[index];
    console.log(this.editInput)
  }

  deleteInvoice(id: string) {
    this.iservice.deleteInvoice(id).then(() => {
      this.toast.success('Invoice successfully deleted')
    })
  }

  confirmFull(invoice: any) {
    const updatedData = {
      final: invoice.total,
      paid: true
    }
    this.iservice.updateInvoice(invoice.id, updatedData).then(() => {
      this.toast.success('Payment status submitted successfully')
    })
  }

  changePayment() {
    this.editInput = !this.editInput;
  }

  editPayment(id: string) {
    const updatedData = {
      paid: true,
      final: this.newPayment
    }
    this.iservice.updateInvoice(id, updatedData).then(() => {
      this.newPayment = 0;
      this.toast.success('New payment saved')
    })
    this.editInput = false;
    console.log(updatedData.final, this.editInput)
  }

  submitNotes(id: string, newNotes: string) {
    console.log(id)
    const updatedData = {
      notes: newNotes
    }
    this.iservice.updateInvoice(id, updatedData).then(() => {
      this.toast.success('Notes updated successfully');
      this.showNotes = false;
      console.log('done')
    })
  }

  generatePDF(index: number) {
    this.selectedInvoice = this.invoices[index];
    this.childPDF = true;
    console.log(this.selectedInvoice.id)
  }
}
