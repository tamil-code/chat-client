import React, { useContext } from 'react'
  import { Avatar } from '@chakra-ui/react'
import { ChatContext } from '../../context/ChatContextProvider';

const SingleChartCard = ({userdata}) => {
  
  const {user,setCurrentChat,setCurrentReceiver,setCurrentMsg} = useContext(ChatContext);
  const anotherUser = userdata.users?.filter((eachuser)=>{
    return eachuser._id!=user._id
  })
  const handlesetCurrentuser = ()=>{
    setCurrentChat(userdata)
    setCurrentReceiver(anotherUser)
    setCurrentMsg([]);
   
  }
  return (
    <div className='hover:bg-[#30A3E6] cursor-pointer items-center border-t-0  bg-white border border-solid border-gray-400 flex gap-4 px-2 py-1' onClick={handlesetCurrentuser}>
    <Avatar size='md' src={anotherUser[0].pic}/>
    <p className="capitalize font-sans font-medium text-xl">{anotherUser[0].username}</p>
 </div>
  )
}

export default SingleChartCard