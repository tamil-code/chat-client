import React, { useState } from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    Input,
    InputGroup,
    InputLeftElement,
    Button
  
  } from '@chakra-ui/react'
import {SearchIcon} from '@chakra-ui/icons'
import SearchSkeleton from './SearchSkeleton';
import { useMutation, useQueryClient } from 'react-query';
import { postAccessChat, postSearchUser } from '../lib/axios';
import UserCard from './usercomponents/UserCard';
const SideDrawer = ({open,handleClose}) => {
    const[searchText,setSearchText] = useState(null);
    const queryClient = useQueryClient();

  const searchUserQuery = useMutation({
    mutationKey:'searchuser',
    mutationFn:(data)=>{
      console.log(data);
      return postSearchUser(data);
    },
    onSuccess:(res)=>{
      console.log(res);
    },
    onError:(err)=>{
      console.log(err);
    }
  })

  const acessUserQuery = useMutation({
    mutationKey:'access-chat',
    mutationFn:(data)=>{
      return postAccessChat(data);
    },
    onSuccess:(res)=>{
      if(res.status==200){
        console.log(res);
        queryClient.invalidateQueries('fetchchat');
        handleClose();
      }
    }
    ,
    onError:(err)=>{
      console.log(err);
    }
  })
    const handleSearchUser = (e)=>{
       setSearchText(e.target.value);
    }
    const handleSubmitSearch = ()=>{
      console.log(searchText);
      if(searchText){
        const payload = {text:searchText,token:JSON.parse(localStorage.getItem('token'))?.token};
        console.log(payload);
         searchUserQuery.mutate(payload);
      }
    }
    if(searchUserQuery.isLoading){
       console.log(searchUserQuery.data);
    }
    const handleAcessChat = (userId)=>{
      const payload = {userId:userId,token:JSON.parse(localStorage.getItem('token'))?.token};
      acessUserQuery.mutate(payload);
    }
  return (
    <Drawer placement={'left'} onClose={handleClose} isOpen={open}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerHeader borderBottomWidth='1px'>
        <p className="font-bold text-xl opacity-[0.7] text-left mb-2">Search user</p>
   <div className="flex gap-2 items-center">
   <InputGroup className='w-fit' width={'fit-content'}>
                  <InputLeftElement>
                   <SearchIcon/>
                  </InputLeftElement>
                  <Input type='text'variant='outline'  placeholder='search a user' onChange={handleSearchUser} />
                 </InputGroup>
            <Button variant='solid' size={'sm'} onClick={handleSubmitSearch} >Go</Button>
   </div>
      </DrawerHeader>
      <DrawerBody>
        
        {searchUserQuery.isLoading?<SearchSkeleton/>
        :
        searchUserQuery.data?.data?.map((user)=>{
            return <UserCard img={user.pic} name={user.username} onclick={handleAcessChat.bind(null,user._id)}/>
        })
        }
      </DrawerBody>
    </DrawerContent>
  </Drawer>
  )
}

export default SideDrawer