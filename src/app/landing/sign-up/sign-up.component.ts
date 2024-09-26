import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signUpForm: FormGroup;
  errorMessage: string | null=null;
  password = '';
  confirmPassword = '';
  
  constructor(
    private fb: FormBuilder, 
    private af:AngularFireAuth, 
    private router:Router
  ) {
      this.signUpForm = this.fb.group({
        email:['',[Validators.required, Validators.email]],
        password:['',[Validators.required, Validators.minLength(6)]]
      })
    }
  
    async onSignUp(){
      if(this.signUpForm?.valid){
        const {email,password} = this.signUpForm?.value;
        try{
          await this.af.createUserWithEmailAndPassword(email,password);
          this.router.navigate(['edit']);
        } catch (error:any) {
          this.errorMessage = error.message;
        }
      }
    }
}
