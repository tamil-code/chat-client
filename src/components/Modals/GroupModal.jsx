import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    Button,
    Tag,
    TagLabel,
    TagCloseButton,
    useToast
  } from '@chakra-ui/react'
import { useMutation, useQueryClient } from 'react-query';
import { postNewGroup, postSearchUser } from '../../lib/axios';
import SearchSkeleton from '../SearchSkeleton';
import UserCard from '../usercomponents/UserCard';

const GroupModal = ({open,onClose}) => {
  const queryClient = useQueryClient();
    const[selectuser,setUserList] = useState([]);
    const[groupName,setGroupName] = useState(null);


    //toast
    const toast = useToast();
    
    const handleSelect = (user)=>{
        const userIndex = selectuser.indexOf(user);
       if(userIndex==-1){
           setUserList((prevList)=>[...prevList,user]);
       }
    }

    const handleRemoveSelectedUser = (selecteduser)=>{
        setUserList((prevList)=>{
            const newList = prevList.filter((user)=>{
                return user._id!=selecteduser._id
            }
                );
            return newList
        })
    }

    const searchUserQuery = useMutation({
        mutationKey:'searchuser',
        mutationFn:(data)=>{
          return postSearchUser(data);
        },
        onError:(err)=>{
          toast({
            title: err?.message,
            status: "warning",
            duration: 4000,
            isClosable: true,
          });
        }
      })
    const newGroupQuery = useMutation({
        mutationKey:'newGroup',
        mutationFn:(data)=>{
            return postNewGroup(data);
        },
        onSuccess:(res)=>{
            if(res.status==200){
                setGroupName(null);
                setUserList([]);
                toast({
                    title:`${res.data?.chatName} created successfully`,
                    description:"new group created",
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                  })
                  queryClient.invalidateQueries('fetchchat');
                  onClose();
                  setCurrentChat(null);
                
            }
        },
        onError:(err)=>{
          toast({
            title: err?.message,
            status: "warning",
            duration: 4000,
            isClosable: true,
          });
        }
    })
    const handleSearch = (e)=>{
        const searchText = e.target.value;
        if(searchText=='')return;
        const payload = {text:searchText,token:JSON.parse(localStorage.getItem('token'))?.token};
        searchUserQuery.mutate(payload);

    }
    const handleCreateGroup = ()=>{
        if(!groupName || selectuser==[])return;
        const userIds = selectuser?.map((user)=>{
            return user._id;
        });
        const payload = {token:JSON.parse(localStorage.getItem('token'))?.token,name:groupName,users:userIds}
        newGroupQuery.mutate(payload)
    }
  return (
    <Modal isOpen={open} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Create Group</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
          <div className="flex flex-col gap-2">
              <Input type='text' placeholder='group name' onChange={(e)=>setGroupName(e.target.value)}/>
              <Input type='text' placeholder='Add members' onChange={handleSearch}/>
              {searchUserQuery.isLoading?
              (<div className="">
                    <SearchSkeleton count={2}/>
              </div>):
              (
                <div className="   w-full h-fit">
                    {/* selected list */}
                    <div className="grid grid-cols-4 grid-flow-row  gap-2 h-fit w-full ">
                        {selectuser?.map((user)=>{
                            return(
                                <Tag
                                size={'lg'}
                                key={user._id}
                                borderRadius='full'
                                variant='solid'
                                colorScheme='green'
                              >
                                <TagLabel>{user.username}</TagLabel>
                                <TagCloseButton onClick={handleRemoveSelectedUser.bind(null,user)}/>
                              </Tag>
                            )
                        })}
                    </div>
                {searchUserQuery.data?.data?.map((user)=>{
                    return (
                       <div className="" onClick={handleSelect.bind(null,user)}>
                         <UserCard img={user.pic} name={user.username}/>
                       </div>
                    )
                })}
          </div>

                )
                
              }
          </div>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={onClose}>
          Close
        </Button>
        <Button variant='ghost' onClick={handleCreateGroup} isLoading={newGroupQuery.isLoading}>Create group</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}

export default GroupModal