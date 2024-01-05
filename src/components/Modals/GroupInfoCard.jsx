import React, { useContext, useState } from 'react'
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
    useToast,
    InputGroup,
    InputRightAddon,
    InputRightElement
  } from '@chakra-ui/react'
import { useMutation, useQueryClient } from 'react-query';
import { deleteGroup, deleteGroupUser, postAddToGroup, postNewGroup, postRenameGroup, postSearchUser } from '../../lib/axios';
import SearchSkeleton from '../SearchSkeleton';
import UserCard from '../usercomponents/UserCard';
import { ChatContext } from '../../context/ChatContextProvider';
import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import OverlaySpinner from '../OverlaySpinner/OverlaySpinner';

const GroupInfoCard = ({open,onClose}) => {
    const queryClient = useQueryClient();

    const {currentChat,setCurrentChat} = useContext(ChatContext);

    const[selectuser,setUserList] = useState([...currentChat?.users]);
    const[groupName,setGroupName] = useState(currentChat?.chatName);
    const[groupEdit,setGroupEdit] = useState(true);

    //toast
    const toast = useToast();
    
    const handleSelect = async (user)=>{
       try{
        const userIndex = selectuser.indexOf(user);
        if(userIndex==-1){
         const payload = {token:JSON.parse(localStorage.getItem('token'))?.token,userId:user?._id,chatId:currentChat?._id}
 
            addToGroupQuery.mutate(payload);
            
        }
       }
       catch(err){
        console.log(err);
       }
    }

    const handleRemoveSelectedUser = (selecteduser)=>{
        console.log(selecteduser._id);
        const payload = {token:JSON.parse(localStorage.getItem('token'))?.token,chatName:groupName,chatId:currentChat?._id,userId:selecteduser._id}
        
        removeGroupUserQuery.mutate(payload);

        if(removeGroupUserQuery.isSuccess){
            setUserList((prevList)=>{
                const newList = prevList.filter((user)=>{
                    return user._id!=selecteduser._id
                }
                    );
                return newList
            })
        }
    }

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
    // const newGroupQuery = useMutation({
    //     mutationKey:'newGroup',
    //     mutationFn:(data)=>{
    //         return postNewGroup(data);
    //     },
    //     onSuccess:(res)=>{
    //         console.log(res);
    //         if(res.status==200){
    //             setGroupName(null);
    //             setUserList([]);
    //             toast({
    //                 title:`${res.data?.data.chatName} created successfully`,
    //                 description:"new group created",
    //                 status: 'success',
    //                 duration: 4000,
    //                 isClosable: true,
    //               })
    //               onClose();
                
    //         }
    //     },
    //     onError:(err)=>{
    //         console.log(err);
    //     }
    // })

    const renameGroupQuery = useMutation({
        mutationKey:'rename-group',
        mutationFn:(data)=>{
            return postRenameGroup(data)
        },
        onSuccess:(res)=>{
            console.log(res);
            if(res?.status==200){
                           
                            toast({
                                title:`Groupname updated successfully`,
                                description:"group name updated",
                                status: 'success',
                                duration: 4000,
                                isClosable: true,
                              })

                              queryClient.invalidateQueries('fetchchat');
                              setCurrentChat(null);
                              onClose();
                            
                        }

        }
    })
    const addToGroupQuery = useMutation({
        mutationKey:"add-group",
        mutationFn:(data)=>{
            return postAddToGroup(data);
        },
        onSuccess:(res)=>{
            console.log(res);
             if( res?.response?.status==403){
            toast({
              title: `access denied`,
              description:"only admin has access to edit the group",
              status: "warning",
              duration: 4000,
              isClosable: true,
            });
          }
          else{
            setUserList([...res.data?.users]);
           toast({
              title: `group updated`,
              description:"new user added to the group",
              status: "success",
              duration: 4000,
              isClosable: true,
            });

             queryClient.invalidateQueries('fetchchat');
             setCurrentChat(res.data)
          }
        },
        onError:(err)=>{
            console.log(err);
        }
    })
    const removeGroupUserQuery = useMutation({
        mutationKey:"remove-user",
        mutationFn:(data)=>{
            return deleteGroupUser(data);
        },
        onSuccess:(res)=>{
            console.log(res);
            if(res?.response?.status==403){
                toast({
                  title: `access denied`,
                  description:"only admin has access to edit the group",
                  status: "warning",
                  duration: 4000,
                  isClosable: true,
                });
              }
              else{
                toast({
                    title: `group updated`,
                    description:" user removed from  the group",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                  });
                
                  setUserList([...res.data?.users]);
                  queryClient.invalidateQueries('fetchchat');
                  setCurrentChat(res?.data)

              }
        }
    })

    const deleteGroupQuery = useMutation({
        mutationKey:"delete-group",
        mutationFn:(data)=>{
            return deleteGroup(data);
        },
        onSuccess:(res)=>{
            console.log(res);
            if(res?.response?.status==403){
                toast({
                    title: `Access deinied`,
                    description:"admin can only delete the group",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                  });
            }
            else{
                queryClient.invalidateQueries('fetchchat');
                toast({
                    title: `Group deleted`,
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                  });
                  setCurrentChat(null);
                  onClose();

            }
        },
        onError:(err)=>{
            console.log(err);
        }
    })
    const handleSearch = (e)=>{
        const searchText = e.target.value;
        if(searchText=='')return;
        const payload = {text:searchText,token:JSON.parse(localStorage.getItem('token'))?.token};
        searchUserQuery.mutate(payload);

    }
  
    const handleEdit = ()=>{
        setGroupEdit(false);

    }

    const handleRename = (e)=>{
        if(currentChat?.chatName==groupName)return;
        console.log();
       if(e.code=="Enter"){
        const payload = {token:JSON.parse(localStorage.getItem('token'))?.token,chatName:groupName,chatId:currentChat?._id}
        renameGroupQuery.mutate(payload)

       }

    }
    const handleDeleteGroup = ()=>{

        const payload = {token:JSON.parse(localStorage.getItem('token'))?.token,chatId:currentChat?._id}
        deleteGroupQuery.mutate(payload);
 
    }
  return (
    <Modal isOpen={open} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Group Info</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
          <div className="flex flex-col gap-2">
             <InputGroup>
             <Input type='text' placeholder='group name' disabled={groupEdit} value={groupName} onKeyDown={handleRename} onChange={(e)=>{
                setGroupName(e.target.value)
             }}/>
             <InputRightElement>
               {groupEdit? <EditIcon onClick={handleEdit} className='cursor-pointer'/>:<CloseIcon fontSize={'x-small'} onClick={()=>{setGroupEdit(true)}} className='cursor-pointer'/>}
             </InputRightElement>
            </InputGroup>
              <Input type='text' placeholder='Add members' onChange={handleSearch}/>
              {searchUserQuery.isLoading?
              (<div className="">
                    <SearchSkeleton count={2}/>
              </div>):
              (
                <div className="w-full h-fit">
                    {/* selected list */}
                    <OverlaySpinner isLoading={removeGroupUserQuery.isLoading||addToGroupQuery.isLoading}>
                    <div className="grid grid-cols-3 grid-flow-row  gap-2 h-fit w-full " >
                        {selectuser?.map((user)=>{
                            return(
                                <Tag
                                size={'lg'}
                                key={user._id}
                                borderRadius='full'
                                variant='solid'
                                colorScheme='green'
                                className='flex justify-between'
                                
                              >
                                <TagLabel>{user.username}</TagLabel>
                                <TagCloseButton onClick={handleRemoveSelectedUser.bind(null,user)}/>
                              </Tag>
                            )
                        })}
                    </div>
                    </OverlaySpinner>
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
        <Button colorScheme='red' mr={3} isLoading={deleteGroupQuery.isLoading} onClick={handleDeleteGroup}>
          Delete Group
        </Button>
        {/* <Button variant='ghost' onClick={handleCreateGroup} isLoading={newGroupQuery.isLoading}>Update group</Button> */}
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}

export default GroupInfoCard