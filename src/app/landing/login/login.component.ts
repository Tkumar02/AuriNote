import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private auth: AngularFireAuth, private router:Router){}

  email: string = '';
  password: string = '';

  login() {
    this.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(()=> this.router.navigate(['home'])
      .catch(error=> 
        console.error('Login error: ', error )
      )
    )
  }
}
