import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InvestmentsService } from '../../services/investments.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-invest-summary',
  templateUrl: './invest-summary.component.html',
  styleUrl: './invest-summary.component.css'
})
export class InvestSummaryComponent {

  allInvestments: any;
  userEmail: string = ''
  showInput: number = -1
  boughtInput: number = -1;
  sellInput: boolean = false;

  constructor(
    private router: Router,
    private iService: InvestmentsService,
    private afAuth: AngularFireAuth,
  ){}

  ngOnInit(): void{
    this.getCurrentUserEmail()
  }

  onAction(action: string) {
    console.log(`Action selected: ${action}`);
    switch (action) {
      case 'add':
        this.router.navigate(['/add-fund'])
        break;
      case 'edit':
        this.router.navigate(['/edit-fund']);
        break;
      case 'view':
        this.viewInvestments();
        break;
      default:
        console.warn('Unknown action');
    } 
  }

  viewInvestments(){
    // this.allInvestments = [
    //   {name:'felix', totalPrice:1000, totalUnits:10},
    //   {name:'caesare', totalPrice:3000, totalUnits:20}
    // ]
    this.iService.viewInvestments(this.userEmail).subscribe(val=>{
      this.allInvestments = val
      console.log(this.allInvestments)
    })
  }

  openBuy(i:number){
    this.boughtInput = i;
  }

  bought(price:string, pricePerUnit:string, date:any, i:number){
    const transaction = {
      investId: this.allInvestments[i].id,
      initialInvested:this.allInvestments[i].totalPrice,
      transactionAmount:0,
      newInvested:0,
      additionalUnits:0,
      pricePerUnit:0,
      date: date
    }
    console.log(this.boughtInput)
    transaction.pricePerUnit = parseFloat(pricePerUnit);
    transaction.transactionAmount = parseFloat(price);
    transaction.additionalUnits =  transaction.transactionAmount / parseFloat(pricePerUnit)
    const totalNewUnits = transaction.additionalUnits + this.allInvestments[i].totalUnits
    transaction.newInvested = this.allInvestments[i].totalPrice+transaction.transactionAmount;
    this.iService.addTransaction(transaction.investId,transaction)
    this.iService.updateInvested(transaction.newInvested,totalNewUnits,transaction.investId)
  }

  sold(units:string, pricePerUnit:string, i:number){
    const transaction = {
      investId: this.allInvestments[i].id,
      initialInvested:this.allInvestments[i].totalPrice,
      unitsSold:0,
      pricePerUnit:0,
      date: new Date(),
      soldAmount: 0,
    }
    console.log(this.boughtInput)
    transaction.pricePerUnit = parseFloat(pricePerUnit);
    transaction.unitsSold = parseFloat(units)
    transaction.soldAmount = transaction.pricePerUnit * transaction.unitsSold;
    const totalNewUnits =  this.allInvestments[i].totalUnits - transaction.unitsSold
    transaction.soldAmount = transaction.unitsSold * transaction.pricePerUnit;
    //this.iService.addTransaction(transaction.investId,transaction)
    //this.iService.updateInvested(transaction.initialInvested,totalNewUnits,transaction.investId)
  }

  sold1(num:number, units:number, i:number){
    const transaction = {
      id:'',
      amount:0,
      newAmount:0,
      date: new Date(),
      reducedUnits:0,
    }
    this.sellInput = true;
    transaction.amount = num;
    transaction.newAmount = this.allInvestments[i].totalPrice - num;
  }

  async getCurrentUserEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userEmail = user.email!;
    }
  }

}
