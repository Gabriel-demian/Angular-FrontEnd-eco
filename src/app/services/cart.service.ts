import { Injectable, TemplateRef } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  // Our shopping cart, an Array of CartItem objects.
  cartItems: CartItem[] = [];

  // Subject is a subclass of Observable. We can use Subject to publish events in our code.
  // The event will be sent to all of subscribers.
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem){

    // Check if we already have the item in our cart.
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length > 0){
      // Find the item in the cart based on item id.
      /*
      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }
      */
      // We change the "for"  for this new feature. 
      // find Returns first element that passes, else returns undefinded.  
      // Executes test for each element in the array until test passes
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // Check if we found it.
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
      // Increment the quantity.
      existingCartItem.quantity ++;
    }
    else{
      // Just add the item to the array. 
      this.cartItems.push(theCartItem);
    }

    // Compute cart total price and total quantity
    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // Publish the new values ... all subscribers will receive the new data. 
    // This will publish events to all subscribers, one event for totalPrice, one event for totalQuantity
    // .next(...) publish/send event. 
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // Log cart data just for debugging purposes.
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }
	
	// .toFixed(2) two digits after decimal 124.98
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('-------------------------');
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity --;

    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }


  remove(theCartItem: CartItem) {

    // Get index of item in the array.
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    // If found, remove the item from the array at the given index
    if(itemIndex > -1){
      
      // Removes elements from an array and, 
      // if necessary, inserts new elements in their place, returning the deleted elements.
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }

  }


}
