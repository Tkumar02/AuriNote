import { Component } from '@angular/core';
import { InvestmentsService } from '../../services/investments.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { InvestForm } from '../../interfaces';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-invest-add',
  templateUrl: './invest-add.component.html',
  styleUrl: './invest-add.component.css'
})

export class InvestAddComponent {

  userEmail: string = ''

  userForm: InvestForm = {
    name: '',
    identifier: '',
    url: '',
    date: new Date(),
    totalPrice: 0,
    pricePerUnit: 0,
    risk: '',
    accumulative: false,
    income: false,
    price: 0,
    totalUnits: 0,
    user: '',
  };

  constructor(
    private investService: InvestmentsService,
    private toast: ToastrService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    this.getCurrentUserEmail()
  }

  onSubmit(form: NgForm) {
    if (this.userForm.totalPrice && this.userForm.pricePerUnit) {
      this.userForm.totalUnits = this.userForm.totalPrice / this.userForm.pricePerUnit
    }
    this.userForm.user = this.userEmail
    console.log(this.userForm)
    this.investService.addInvest(this.userForm).then(() => {
      this.toast.success('Investment added successfully')
      form.reset()
    }
    )
  }

  async getCurrentUserEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userEmail = user.email!;
    }
  }
}
