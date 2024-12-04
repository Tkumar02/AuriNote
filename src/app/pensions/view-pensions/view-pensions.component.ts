import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PensionsService } from '../../services/pensions.service';
import { Transact } from '../../interfaces';

@Component({
  selector: 'app-view-pensions',
  templateUrl: './view-pensions.component.html',
  styleUrl: './view-pensions.component.css'
})
export class ViewPensionsComponent {

  userEmail = '';
  allPensions: any;
  view: boolean = false;
  transaction: Transact = {
    user: '',
    initialValue: 0,
    newValue: 0,
    date: new Date(),
    amount: 0,
    id: '',
  }

  constructor(
    private afAuth: AngularFireAuth,
    private pService: PensionsService
  ){}

  ngOnInit(): void{
    this.getCurrentUserEmail()
  }

  async getCurrentUserEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userEmail = user.email!;
    }
  }

  viewPensions(){
    this.pService.viewPensions(this.userEmail).subscribe(val=>{
      this.allPensions = val
      console.log(this.allPensions)
      this.view = true
    })
  }

  add(i:number){
    console.log(this.allPensions[i].id)
  }

  sendTransaction(i:number){
    this.transaction.user = this.userEmail
    this.transaction.id = this.allPensions[i].id
  }
}
