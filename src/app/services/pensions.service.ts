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
}
