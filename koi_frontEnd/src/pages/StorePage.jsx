import React, { useEffect } from 'react'
import StoreTemplate from '../components/template/StoreTemplate'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { PATH } from '../constant'

const StorePage = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin)
  const navigate = useNavigate()

  useEffect(() => {
    if(userLogin?.roles && userLogin?.roles[0].name === "ROLE_CONTRIBUTOR") {
      message.warning("Please register account Member to access this feature.");
      navigate(PATH.MANAGE_BLOG);
    }
  })

  return (
    <div>
      <StoreTemplate />
    </div>
  )
}

export default StorePage
