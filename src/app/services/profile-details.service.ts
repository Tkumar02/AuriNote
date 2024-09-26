import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr'

@Injectable({
  providedIn: 'root'
})
export class ProfileDetailsService {

  constructor(
    private afs: AngularFirestore, 
    private router: Router, 
    private toast: ToastrService) { }

  addProfile(data:any){
    this.afs.collection('profiles').add(data)
      .then(() => {
        console.log('Profile saved successfully!');
        this.router.navigate(['home']);
      })
      .catch((error) => {
        console.error('Error saving profile:', error);
      }); 
  }

  createProfile(data:any): Promise<void>{
    const id = this.afs.createId();
    return this.afs.collection('profiles').doc(id).set({id,...data})
    .then(()=>{
      this.toast.success('Profile Successfully Created')
      this.router.navigate(['home'])
    })
  }

  getProfiles(){
    return this.afs.collection('profiles').valueChanges()
  }

  getProfileDetails(user:string){
    return this.afs.collection('profiles', ref=>ref.where('email','==',user)).valueChanges()
  }

  updateProfile(id:string, data:any): Observable<any> {
    return new Observable (observer=>{
      this.afs.collection('profiles').doc(id).update(data)
        .then(()=>{
          observer.next({success:true});
          observer.complete();
          this.toast.success('Profile successfully updated')
          this.router.navigate(['home'])
        })
        .catch(error=>{
          observer.error(error);
        });
    });
  };
}
