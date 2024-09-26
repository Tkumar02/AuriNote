import { CanActivateFn, CanActivate, Router, ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot, Route } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map,tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
  //   throw new Error('Method not implemented.');
  // }

  constructor(private afAuth: AngularFireAuth, private router:Router){}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user=> !!user),
      tap(loggedIn => {
        if(!loggedIn){
          this.router.navigate(['/login'])
        }
      })
    )
  }
  
}

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// }
