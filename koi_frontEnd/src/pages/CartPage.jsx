import React from 'react'
import Cart from '../components/ui/cart/Cart'
import { useSelector } from 'react-redux'

const CartPage = () => {
  return (
    <div className='h-full' >
      <Cart />
    </div>
  );
}

export default CartPage
