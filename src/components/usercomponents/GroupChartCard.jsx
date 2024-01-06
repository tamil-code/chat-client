import React, { useContext } from 'react'
import { Avatar } from '@chakra-ui/react'

//images
import groupImg from '../../assets/group.png'
import style from './dummy.module.css'
import { ChatContext } from '../../context/ChatContextProvider'
const GroupChartCard = ({user}) => {
  const {setCurrentChat,setCurrentMsg} = useContext(ChatContext);
  
  const handleCurrentChat = ()=>{
    setCurrentChat(user);
    setCurrentMsg([]);

  }
  return (
    <div className={`  hover:bg-[#30A3E6] cursor-pointer items-center bg-white border border-solid border-t-0 border-gray-400  flex gap-4 px-2 py-1`} onClick={handleCurrentChat}  >
    <Avatar size='md' src={groupImg}/>
    <p className="capitalize font-sans font-medium text-xl">{user?.chatName}</p>
 </div>
  )
} 

export default GroupChartCard  