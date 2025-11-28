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
      this.invoices = val
      if (this.invoices.length < 1) {
        this.showBox = true
      }
      this.invoices.sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime());
    })
  }

  retrieveInvoices(startDate: any, endDate: any) {
    // Check if both dates are provided.
    if (startDate && endDate) {
      // If dates are provided, clear the message box state.
      this.dateBox = false;
      this.message = 'Summary'

      this.iservice.getUserInvoices(this.userEmail).subscribe(val => {
        this.allInvoices = val;

        // Convert start and end dates to Date objects for proper comparison
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Set the end date's time to the end of the day to include all invoices on that date
        end.setHours(23, 59, 59, 999);

        this.invoices = this.allInvoices.filter(invoice => {
          const invoiceDate = new Date(invoice.date);
          return invoiceDate.getTime() >= start.getTime() && 
          invoiceDate.getTime() <= end.getTime()&&
          invoice.businessName === this.selectedBusiness;
        });

        // If no invoices are found within the date range, show the message box
        if (this.invoices.length < 1) {
          this.dateBox = true;
        }

        // Calculate the total sum of filtered invoices
        const totalSum = this.invoices.reduce((sum: number, invoice: any) => {
          return sum + invoice.total;
        }, 0);
        console.log(totalSum);
        this.totalSum = totalSum
        this.invoiceTotal = this.invoices.length

        // Sort the filtered invoices
        this.invoices.sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
    } else {
      // If a date is missing, clear the invoices and show the message box
      this.invoices = [];
      this.dateBox = true;
      this.message = "Please select a date range";
      this.totalSum = 0
      this.invoiceTotal = 0
    }
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
