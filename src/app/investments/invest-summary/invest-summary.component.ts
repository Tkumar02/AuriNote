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
  boughtInput: boolean = false;
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
    this.allInvestments = [
      {name:'felix', totalPrice:1000, totalUnits:10},
      {name:'caesare', totalPrice:3000, totalUnits:20}
    ]
    // this.iService.viewInvestments(this.userEmail).subscribe(val=>{
    //   this.allInvestments = val
    //   console.log(this.allInvestments)
    // })
  }

  bought(num:number, units:number, i:number){
    const transaction = {
      id:'',
      initialValue:0,
      amount:0,
      newValue:0,
      additionalUnits:0,
      date: new Date()
    }
    this.boughtInput = true;
    transaction.additionalUnits = units;
    transaction.amount = num;
    transaction.newValue = this.allInvestments[i].totalPrice+num;
  }

  sold(num:number, units:number, i:number){
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
