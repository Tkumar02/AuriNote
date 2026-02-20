


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ProfileDetailsService } from '../services/profile-details.service';

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css']
})
export class EditDetailsComponent implements OnInit {
  editDetailsForm: FormGroup;
  userEmail: string = '';
  profile: any;
  profileExists = false;
  profileId: string = '';
  businessTypes = ['Sole Trader', 'Ltd Company'];

  constructor(
    private fb: FormBuilder,
    private pservice: ProfileDetailsService,
    private afAuth: AngularFireAuth,
  ) {
    // Initialize the form group with 'name', 'address', 'businesses', and 'bankDetails'
    this.editDetailsForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      type:['', Validators.required],
      businesses: this.fb.array([]),  
      bankDetails: this.fb.array([]),
      clients: this.fb.array([])  
    });
  }

  ngOnInit() {
    this.getCurrentUserEmail();
  }

  // Getter for 'bankDetails' FormArray
  get bankDetails(): FormArray {
    return this.editDetailsForm.get('bankDetails') as FormArray;
  }

  // Getter for 'businesses' FormArray
  get businesses(): FormArray {
    return this.editDetailsForm.get('businesses') as FormArray;
  }

  get clients(): FormArray {
    return this.editDetailsForm.get('clients') as FormArray;
  }

  // Add a new bank detail form group to 'bankDetails' FormArray
  addBank(bank?: any) {
    const bankGroup = this.fb.group({
      bankNickName: [bank ? bank.bankNickName : '', Validators.required],
      bankName: [bank ? bank.bankName : '', Validators.required],
      accountNumber: [bank ? bank.accountNumber : '', Validators.required],
      sortCode: [bank ? bank.sortCode : '', Validators.required]
    });
    this.bankDetails.push(bankGroup);
  }

  // Helper method
  isSynced(index: number): boolean {
    const control = this.businesses.controls[index];
    return control ? !!control.get('companyId')?.value : false;
  }

  // Add a new business form group to 'businesses' FormArray
  addBusiness(business?: any) {
    const isSynced = !!(business && business.companyId);

    const businessGroup = this.fb.group({
      businessName: [business ? business.businessName : '', Validators.required],
      businessAddress: [business ? business.businessAddress : '', Validators.required],
      // Set the state directly in the control definition
      businessType: [{ 
        value: business ? (business.businessType || business.type) : 'Sole Trader', 
        disabled: isSynced 
      }, Validators.required],
      companyId: [business?.companyId || null]
    });

    this.businesses.push(businessGroup);
  }

  addClient(client?: any) {
    const clientGroup = this.fb.group({
      clientName: [client ? client.clientName : '', Validators.required],
      clientAddress: [client ? client.clientAddress : '', Validators.required]
    });
    this.clients.push(clientGroup);
  }

  // Remove a bank detail form group from 'bankDetails' FormArray
  removeBank(index: number) {
    this.bankDetails.removeAt(index);
  }

  // Remove a business form group from 'businesses' FormArray
  removeBusiness(index: number) {
    this.businesses.removeAt(index);
  }

  removeClient(index: number) {
    this.clients.removeAt(index);
  }

  // Populate form with profile data (name, address, businesses, and bank details)
  populateFormWithProfileData() {
    if (this.profileExists) {
      this.editDetailsForm.patchValue({
        name: this.profile.name,
        address: this.profile.address
      });

      // Populate the businesses if they exist
      this.clearFormArray(this.businesses);
      if (this.profile.businesses && this.profile.businesses.length > 0) {
        this.profile.businesses.forEach((business: any) => {
          this.addBusiness(business); // Pass the business data to addBusiness
        });
      }

      // Populate the bank details if they exist
      this.clearFormArray(this.bankDetails);
      if (this.profile.bankDetails && this.profile.bankDetails.length > 0) {
        this.profile.bankDetails.forEach((bank: any) => {
          this.addBank(bank); // Pass the bank data to addBank
        });
      }

      this.clearFormArray(this.clients);
      if (this.profile.clients && this.profile.clients.length > 0) {
        this.profile.clients.forEach((client: any) => {
          this.addClient(client); 
        });
      }
    }
  }

  clearFormArray(formArray:FormArray){
    while (formArray.length!==0) {
      formArray.removeAt(0);
    }
  }

  // Handle form submission
  onSubmit() {
    const profileData = {
      email: this.userEmail,
      ...this.editDetailsForm.getRawValue()
    };

    if(this.profileId && this.profileExists){
      this.pservice.updateProfile(this.profileId,profileData).subscribe(res=>{
        console.log('Profile updated successfully')
      });
    } else {
      this.pservice.createProfile(profileData);
    }
  }

  // Check if a profile exists for the current user and populate the form
  checkExistingProfile() {
    this.pservice.getProfileDetails(this.userEmail).subscribe(val => {
      this.profile = val[0]; // Assuming the profile comes as an array, take the first item
      if (this.profile) {
        this.profileExists = true;
        this.profileId = this.profile.id;
        this.populateFormWithProfileData(); // Populate the form with existing profile data
      }
    });
  }

  // Get the current logged-in user's email
  async getCurrentUserEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userEmail = user.email!;
      this.checkExistingProfile();
    }
  }
}

