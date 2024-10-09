import { Injectable } from '@angular/core';
import { Invoice } from '../interfaces';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  createInvoice(invoice: Invoice): Promise<void>{
    const id = this.afs.createId();
    return this.afs.collection('invoices').doc(id).set({id,...invoice})
  }

  deleteInvoice(invoiceID:string): Promise <void> {
    return this.afs.collection('invoices').doc(invoiceID).delete()
  }

  getAllInvoices(): Observable<Invoice[]> {
    return this.afs.collection<Invoice>('invoices').valueChanges();
  }

  getUserInvoices(name:string): Observable<Invoice[]> {
    return this.afs.collection<Invoice>('invoices', ref => ref.where('userEmail','==',name)).valueChanges()
  }

  updateInvoice(invoiceId: string, updatedData: any) {
    return this.afs.collection('invoices').doc(invoiceId).update(updatedData);
  }

}
