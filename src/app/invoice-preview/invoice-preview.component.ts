import { Component, Input } from '@angular/core';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrl: './invoice-preview.component.css'
})
export class InvoicePreviewComponent {
  @Input() message?: any;

  ngOnInit(): void {
    console.log(this.message, '<-- received message')
  }

  generatePDF() {
    // Target the element you want to convert into PDF
    const invoiceElement = document.querySelector('.invoicePreview') as HTMLElement;
  
    // Options for html2pdf
    const options = {
      margin: 1,
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
  
    // Generate PDF
    html2pdf().from(invoiceElement).set(options).save();
  }
}
