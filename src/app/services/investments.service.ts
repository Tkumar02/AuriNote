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
}
