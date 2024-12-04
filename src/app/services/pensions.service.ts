import { Injectable } from '@angular/core';
import { PensionForm } from '../interfaces';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class PensionsService {

  constructor(private afs:AngularFirestore) { }

  addPension(form:PensionForm){
    const id = this.afs.createId();
    return this.afs.collection('pensions').doc(id).set({id,...form})
  }

  viewPensions(user:string){
    return this.afs.collection('pensions',ref=>ref.where('user','==',user)).valueChanges()
  }

  viewTransactions(userId:string){
    const pensionDoc = this.afs.collection('pensions').doc(userId);
    return pensionDoc.collection('transactions').valueChanges()
  }

  addTransaction(userId:string,data:any){
    const pensionDoc = this.afs.collection('pensions').doc(userId);
    const id = this.afs.createId();
    return pensionDoc.collection('transactions').doc(id).set({id,...data})
  }

  updateAmount(newValue:number,id:string){
    return this.afs.collection('pensions').doc(id).update({total:newValue})
  }
}
