import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { LoginComponent } from './landing/login/login.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { NavLandingComponent } from './navbars/nav-landing/nav-landing.component';
import { SignUpComponent } from './landing/sign-up/sign-up.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';
import { HomeComponent } from './landing/home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SummaryComponent } from './summary/summary.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InvoiceFormComponent,
    NavLandingComponent,
    SignUpComponent,
    EditDetailsComponent,
    HomeComponent,
    AboutUsComponent,
    SummaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideAnimations(),
    provideToastr(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
