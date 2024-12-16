import { Injectable } from '@angular/core';
import { InvestForm } from '../interfaces';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class InvestmentsService {

  constructor(
    private afs: AngularFirestore
  ) { }

  addInvest(form: InvestForm){
    const id = this.afs.createId();
    return this.afs.collection('investments').doc(id).set({id,...form})
  }

  viewInvestments(user:string){
    return this.afs.collection('investments', ref=>ref.where('user','==',user)).valueChanges()
  }

  addTransaction(docId:string,data:any){
    const investDoc = this.afs.collection('investments').doc(docId);
    const id = this.afs.createId();
    return investDoc.collection('transactions').doc(id).set({id,...data})
  }

  updateInvested(newPrice:number,newUnits:number,id:string){
    return this.afs.collection('investments').doc(id).update({totalPrice:newPrice, totalUnits:newUnits})
  }
}
