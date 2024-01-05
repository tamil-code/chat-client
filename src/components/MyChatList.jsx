import { AddIcon } from '@chakra-ui/icons'
import { Button, Input } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { getAllChats } from '../lib/axios'
import SearchSkeleton from './SearchSkeleton'
import GroupChartCard from './usercomponents/GroupChartCard'
import SingleChartCard from './usercomponents/SingleChartCard'
import GroupModal from './Modals/GroupModal'



const MyChatList = () => {
  const[open,setOpen] = useState(false);

const fetchChatList = useQuery({
  queryKey:'fetchchat',
  queryFn:()=>{
    console.log();
    return getAllChats(JSON.parse(localStorage.getItem('token'))?.token)
  },
  onSuccess:(data)=>{
    console.log(data);
  },
  onError:(err)=>{
    console.log(err);
  }
})



const handleGroupModal = ()=>{
  setOpen(true)
;}
const onClose = ()=>{setOpen(false)}
  return (
    <div className='h-full col-start-1 col-end-2 rounded-tl-2xl  rounded-bl-2xl '>
        <div className="bg-white drop-shadow-sm    flex items-center justify-between px-2 py-2">
              <p className="uppercase font-medium">my chats</p>
              <Button rightIcon={<AddIcon/>} size={'sm'}  colorScheme='twitter' onClick={handleGroupModal}>Group</Button>
        </div>
       <div className="border-t border-t-gray-400">
       {fetchChatList.isLoading?<SearchSkeleton/>
        :
        fetchChatList.data?.data?.map((user)=>{
            if(user.isGroupChat){
              return <GroupChartCard user={user}/>
            }
            else{
              return <SingleChartCard userdata={user}/>
            }
        })
        }
       </div>
    <GroupModal open={open} onClose={onClose}/>
    </div>
  )
}

export default MyChatList