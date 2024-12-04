import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invest-summary',
  templateUrl: './invest-summary.component.html',
  styleUrl: './invest-summary.component.css'
})
export class InvestSummaryComponent {

  constructor(
    private router: Router
  ){}

  onAction(action: string) {
    console.log(`Action selected: ${action}`);
    switch (action) {
      case 'add':
        this.router.navigate(['/add-fund'])
        break;
      case 'edit':
        this.router.navigate(['/edit-fund']);
        break;
      default:
        console.warn('Unknown action');
    }
  }


}
