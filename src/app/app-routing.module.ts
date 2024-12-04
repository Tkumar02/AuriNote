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
import { InvestAddComponent } from './investments/invest-add/invest-add.component';
import { InvestSummaryComponent } from './investments/invest-summary/invest-summary.component';
import { InvestEditComponent } from './investments/invest-edit/invest-edit.component';
import { AddPensionComponent } from './pensions/add-pension/add-pension.component';
import { ViewPensionsComponent } from './pensions/view-pensions/view-pensions.component';

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'about-us', component: AboutUsComponent},
  {path:'', redirectTo: 'about-us', pathMatch:'full'},
  {path:'create', component:InvoiceFormComponent, canActivate: [AuthGuard]},
  {path:'signup', component:SignUpComponent},
  {path:'edit', component:EditDetailsComponent, canActivate: [AuthGuard]},
  {path:'home', component:HomeComponent, canActivate: [AuthGuard]},
  {path: 'summary', component:SummaryComponent, canActivate: [AuthGuard]},
  {path: 'add-fund', component:InvestAddComponent, canActivate: [AuthGuard]},
  {path: 'summary-funds', component:InvestSummaryComponent, canActivate: [AuthGuard]},
  {path: 'edit-fund', component:InvestEditComponent, canActivate: [AuthGuard]},
  {path: 'add-pension', component: AddPensionComponent, canActivate: [AuthGuard]},
  {path: 'summary-pensions', component: ViewPensionsComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
