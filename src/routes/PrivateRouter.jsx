import React, { useContext } from 'react'
import {Navigate,Outlet} from 'react-router-dom'
import { ChatContext } from '../context/ChatContextProvider'

const PrivateRouter = () => {
  
    const {isAuth} = useContext(ChatContext);
  return (
    isAuth?<Outlet/>:<Navigate to='/'/>
  )
}

export default PrivateRouter