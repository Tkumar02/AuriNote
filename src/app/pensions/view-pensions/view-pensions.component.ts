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
  transactions: any;
  view: boolean = false;
  transaction: Transact = {
    user: '',
    initialValue: 0,
    newValue: 0,
    date: new Date(),
    amount: 0,
  }
  inputBox: boolean = false;
  showInput: number = -1;
  addAmount: number = 0;
  memNumber: string = '';
  memNotes: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private pService: PensionsService
  ) { }

  ngOnInit(): void {
    this.getCurrentUserEmail()
  }

  async getCurrentUserEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userEmail = user.email!;
    }
  }

  viewPensions() {
    this.pService.viewPensions(this.userEmail).subscribe(val => {
      this.allPensions = val
      console.log(this.allPensions)
      this.view = true
    })
  }

  add(i: number) {
    console.log(this.allPensions[i].id)
    this.showInput = i
  }

  sendTransaction(i: number, num: string) {
    this.transaction.user = this.userEmail
    this.transaction.initialValue = this.allPensions[i].total
    this.transaction.amount = parseFloat(num)
    if (this.transaction.initialValue) {
      this.transaction.newValue = this.transaction.initialValue + this.transaction.amount
    }
    console.log(this.transaction)
    this.pService.addTransaction(this.allPensions[i].id, this.transaction)
    if (this.transaction.newValue) {
      this.pService.updateAmount(this.transaction.newValue, this.allPensions[i].id)
    }
  }

  close() {
    this.showInput = -1
  }

  viewTransactions(i: number) {
    this.pService.viewTransactions(this.allPensions[i].id).subscribe(val => {
      this.transactions = val
    })
  }

  viewMem(i: number) {
    this.memNumber = this.allPensions[i].membershipNumber;
    this.memNotes = this.allPensions[i].notes
  }
}
