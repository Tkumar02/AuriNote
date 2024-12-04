import { Component } from '@angular/core';
import { InvestmentsService } from '../../services/investments.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { InvestForm } from '../../interfaces';

@Component({
  selector: 'app-invest-add',
  templateUrl: './invest-add.component.html',
  styleUrl: './invest-add.component.css'
})

export class InvestAddComponent {

  userForm: InvestForm = {
    name: '',
    isin: '',
    date: new Date(),
    totalPrice: 0,
    totalUnits:0,
    risk: '',
    accumulative: false,
    income: false,
    price:0,
  };

  constructor(
    private investService: InvestmentsService,
    private toast: ToastrService
  ){}

  onSubmit(form:NgForm){
    if(this.userForm.totalPrice && this.userForm.totalUnits){
      this.userForm.price = this.userForm.totalPrice / this.userForm.totalUnits
    }
    console.log(this.userForm)
    this.investService.addInvest(this.userForm).then(()=>{
        this.toast.success('Investment added successfully')
        form.reset()
      }
    )
  }
}
