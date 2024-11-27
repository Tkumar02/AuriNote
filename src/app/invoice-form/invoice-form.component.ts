import { Component } from '@angular/core';
import { InvoiceService } from '../services/invoice.service';
import { ProfileDetailsService } from '../services/profile-details.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.css'
})
export class InvoiceFormComponent {
  clientName: string = '';
  invoiceNumber: string = '';
  userEmail: string = '';
  todayDate: any;
  dateDue: any;
  notes = '';
  items = [{ description:'', quantity:0, price:0}];
  total = 0;
  details: any;
  allInvoices: any;
  selectedBusiness: string = '';
  selectedAddress: string = '';
  selectedBank: string = '';
  bankName: string = '';
  sortCode: string = '';
  accountNumber: string = '';
  generate: boolean = false;
  futureDate= new Date;
  oneBank: boolean = false;
  businesses: boolean = false;
  
  constructor(
    private invoiceService:InvoiceService, 
    private afAuth: AngularFireAuth,
    private pService: ProfileDetailsService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void{
    this.getCurrentUserEmail();
    this.todayDate = new Date().toISOString().split('T')[0];
    const todayTempDate = new Date()
    this.futureDate.setDate(todayTempDate.getDate() + 14)
    this.dateDue = this.futureDate.toISOString().split('T')[0];
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
      date: this.todayDate, 
      dueDate: this.dateDue,
      items: this.items, 
      total: this.total,
      partialPayment:0, 
      paid:false, 
      final: 0,
      notes:this.notes,
      businessName: this.selectedBusiness,
      businessAddress: this.selectedAddress,
      bankName:this.bankName,
      accountNumber: this.accountNumber,
      sortCode: this.sortCode,
      invoiceID:this.invoiceNumber};
    this.invoiceService.createInvoice(invoice).then(()=> {
      this.toast.success('Invoice successfully saved')
    })
    this.generate = true;
  }

  onBankChange(){
    if (this.details && this.details.bankDetails) {
      const selectedBankObj = this.details.bankDetails.find((bank: { bankNickName: string; }) => bank.bankNickName === this.selectedBank);
      if (selectedBankObj) {
        this.bankName = selectedBankObj.bankName;
        this.sortCode = selectedBankObj.sortCode;
        this.accountNumber = selectedBankObj.accountNumber;
      } else {
        this.bankName = '';
        this.sortCode = '';
        this.accountNumber = '';
      }
    }
  }

  onBusinessChange(){
    if (this.businesses) {
      const selectedBusinessObj = this.details.businesses.find((business: { businessName: string; }) => business.businessName === this.selectedBusiness);
      if (selectedBusinessObj) {
        this.selectedAddress = selectedBusinessObj.businessAddress;
      } else {
        this.selectedAddress = this.details.address;
      }
    }
  }

  onClientChange(){
    let count = 0
    if(this.clientName){
      for(let invoice of this.allInvoices){
        if(invoice.clientName === this.clientName){
          count++
        }
      }
      this.invoiceNumber = this.clientName.slice(0,4) + (count+1).toString()+ '-'
    }
    //console.log(count,'here')
  }

  generatePDF() {
    // Target the element you want to convert into PDF
    const invoiceElement = document.querySelector('.invoicePreview') as HTMLElement;
  
    // Options for html2pdf
    const options = {
      margin: 1,
      filename: this.invoiceNumber+'.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
  
    // Generate PDF
    html2pdf().from(invoiceElement).set(options).save();
  }
  

  async getCurrentUserEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userEmail = user.email!;
    }
    this.pService.getProfileDetails(this.userEmail).subscribe(val=>{
      this.details = val[0];
      console.log(this.details.clients)
      if(Object.keys(this.details.bankDetails).length == 1){
        this.oneBank = true;
        this.bankName = this.details.bankDetails[0].bankName
        this.sortCode = this.details.bankDetails[0].sortCode
        this.accountNumber = this.details.bankDetails[0].accountNumber
      }
      if(this.details.businesses.length>0){
        this.businesses = true;
      }
      else{
        this.selectedBusiness = this.details.name;
        this.selectedAddress = this.details.address;
      }
    })
    this.invoiceService.getUserInvoices(this.userEmail).subscribe(val=>{
      this.allInvoices=val
      //console.log(val)
    })
  }
}
