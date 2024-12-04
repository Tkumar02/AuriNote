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
    this.iService.viewInvestments(this.userEmail).subscribe(val=>{
      this.allInvestments = val
      console.log(this.allInvestments)
    })
  }

  async getCurrentUserEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userEmail = user.email!;
    }
  }

}
