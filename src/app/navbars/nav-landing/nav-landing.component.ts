import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-nav-landing',
  templateUrl: './nav-landing.component.html',
  styleUrl: './nav-landing.component.css'
})
export class NavLandingComponent {
  isLoggedIn$!: Observable<boolean>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ){ }

  ngOnInit(): void{
    this.isLoggedIn$ = this.afAuth.authState.pipe(
      map(user=> !!user)
    )
  }

  signOut(){
    this.afAuth.signOut().then(()=>{
      this.router.navigate(['login'])
    }).catch((error:any)=>{
      console.error('Error signing out')
    })
  }
}
