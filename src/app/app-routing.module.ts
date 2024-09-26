import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './landing/login/login.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { SignUpComponent } from './landing/sign-up/sign-up.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';
import { HomeComponent } from './landing/home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'about-us', component: AboutUsComponent},
  {path:'', redirectTo: 'about-us', pathMatch:'full'},
  {path:'create', component:InvoiceFormComponent, canActivate: [AuthGuard]},
  {path:'signup', component:SignUpComponent},
  {path:'edit', component:EditDetailsComponent, canActivate: [AuthGuard]},
  {path:'home', component:HomeComponent, canActivate: [AuthGuard]},
  {path: 'summary', component:SummaryComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
