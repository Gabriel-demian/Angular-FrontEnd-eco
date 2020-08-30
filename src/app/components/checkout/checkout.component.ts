import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EcommerceFormService } from 'src/app/services/ecommerce-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  
  creditCardYears:number[] = [];
  creditCardMonths:number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder, private ecommerceFormService: EcommerceFormService) { }

  ngOnInit(): void {

    //.group()  A collection of child controls. The key for each child is the name under which it is registered. description — Construct a new FormGroup instance.
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required, Validators.minLength(2)]),
        lastName:  new FormControl('',[Validators.required, Validators.minLength(2)]),
        email:  new FormControl('',
                                [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
        
        )
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // Populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.ecommerceFormService.getCreditCardMonths(startMonth).subscribe(
      //JSON.stringify ==> Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
      data =>{
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // Populate credit card years
    this.ecommerceFormService.getCreditCardYears().subscribe(
      //JSON.stringify ==> Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
      data =>{
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // Populate countries
    this.ecommerceFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }

  copyShippingAddressToBillingAddress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      // Bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();

      // Bug fix for states
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears(){

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // If the current year equals the selected year, then start with the current month

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }
    else{
      startMonth = 1;
    }

    this.ecommerceFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )

  }

  
  getStates(formGroupName: string){

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.ecommerceFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data; 
        }
        else {
          this.billingAddressStates = data;
        }

        // Select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

  onSubmit(){
    console.log('**************************************************************');
    console.log("Handling the submit button:");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log("Customer");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log('--------------------------------------------')
    console.log("Shipping Address");
    console.log(this.checkoutFormGroup.get('shippingAddress').value);
    console.log('--------------------------------------------')
    console.log("Billing Address");
    console.log(this.checkoutFormGroup.get('billingAddress').value);
    console.log('--------------------------------------------')
    console.log("CreditCard");
    console.log(this.checkoutFormGroup.get('creditCard').value);
    console.log('--------------------------------------------')
    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);
    console.log('**************************************************************');
  }

  
}
