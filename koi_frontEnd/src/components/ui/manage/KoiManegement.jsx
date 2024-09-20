import React from 'react'
import { useGetAllKoi } from '../../../hooks/koi/useGetAllKoi.js'

const KoiManegement = () => {
    const { data: lstKoi } = useGetAllKoi()
    console.log(lstKoi)
  return (
      <></>
  )
}

export default KoiManegement
