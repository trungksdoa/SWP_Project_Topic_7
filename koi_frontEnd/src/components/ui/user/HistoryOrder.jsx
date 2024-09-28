import React from 'react'
import { useGetOrder } from '../../../hooks/order/useGetOrder'
import { useSelector } from 'react-redux'

const HistoryOrder = () => {
    const userLogin = useSelector((state) => state.manageUser.userLogin)
    const { data: lstOrder } = useGetOrder(userLogin?.id)
    console.log(lstOrder)
  return (
    <div className='my-[60px]'>
        <h2 className='font-bold text-[24px]'>History Order</h2>
    </div>
  )
}

export default HistoryOrder
