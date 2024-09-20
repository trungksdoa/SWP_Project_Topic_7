import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetCartByUserId } from '../../../hooks/manageCart/useGetCartByUserId'
import { manageProductThunks } from '../../../store/manageProduct'

const Cart = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin)
  const { data: carts } = useGetCartByUserId(userLogin?.id)
  const dispatch = useDispatch()
  const prdId = []

  carts?.map((prd) => {
    prdId.push(prd?.productId)
  })

  useEffect(() => {
    if (carts) {
      const productIdList = carts.map((prd) => prd?.productId)
      console.log(productIdList)
      productIdList?.map((id) => {
        dispatch(manageProductThunks.getProductThunk(id))
        .unwrap()
        .then((res) => {
          console.log(res)
        })
      })
    }
  }, [carts])


  return (
    <div>
      
    </div>
  )
}

export default Cart