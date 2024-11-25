import React from 'react'
import CartItems from '../Components/CartItems/CartItems'
import Navbar from '../Components/Navbar/Navbar'

const Cart = () => {
  return (
    <div className='cart'>
      <Navbar/>
      <CartItems />
    </div>
  )
}

export default Cart
