import { Avatar } from '@chakra-ui/react'
import React from 'react'

const ReceiverChartCardWithProfile = ({content,sender,senderProfile}) => {
  return (
   <div className="flex flex-row items-center pl-4 mt-2 min-w-fit">
    <Avatar src={senderProfile} size={'md'}/>
         <div class="text-sm px-4 py-2 w-fit h-fit bg-white text-black rounded-lg  mt-2 relative before:absolute before:content-[''] before:w-3 before:h-3 ml-4 before:bg-white before:rotate-45 before: before:-left-1 before:top-4">
            <div className="pb-2 font-semibold text-[#0088cc] capitalize">{sender}</div>
            <div className="">{content}</div>
        </div>
   </div>
  )
}

export default ReceiverChartCardWithProfile