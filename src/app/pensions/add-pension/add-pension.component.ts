import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PensionForm } from '../../interfaces';
import { PensionsService } from '../../services/pensions.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-add-pension',
  templateUrl: './add-pension.component.html',
  styleUrl: './add-pension.component.css'
})
export class AddPensionComponent {

  userEmail = '';
  userForm: PensionForm = {
    name: '',
    date: new Date(),
    total: 0,
    type: '',
    membershipNumber: '',
    notes:'',
    user: '',
  };

  constructor(
    private pService: PensionsService,
    private toast: ToastrService,
    private afAuth: AngularFireAuth
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

  onSubmit(form:NgForm){
    this.userForm.user = this.userEmail;
    console.log(this.userForm)
    this.pService.addPension(this.userForm).then(()=>{
        this.toast.success('Investment added successfully')
        form.reset()
      }
    )
  }
}
