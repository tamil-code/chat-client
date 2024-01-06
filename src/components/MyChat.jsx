import React, { useContext, useEffect, useRef, useState } from 'react'
import { Avatar, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, useToast } from '@chakra-ui/react'
import ScrollableFeed from 'react-scrollable-feed'

//icons
import { IoSend } from "react-icons/io5"; 
import { FaEllipsisV } from "react-icons/fa";

//context
import { ChatContext } from '../context/ChatContextProvider';

import groupImg from '../assets/group.png'
import SenderChatCard from './chartCard/ChartCard';
import ReceiverChartCard from './chartCard/ReceiverChartCard';
import GroupInfoCard from './Modals/GroupInfoCard';

import {io} from 'socket.io-client'
import ReceiverChartCardWithProfile from './chartCard/ReceiverChartCardWithProfile';
import { useMutation } from 'react-query';
import { getAllMessages } from '../lib/axios';

//loader css
import '../App.css'
import { isAxiosError } from 'axios';

const MyChat = () => {
  
  const {currentChat,currentReceiver,user,currentMsg,setCurrentMsg} = useContext(ChatContext);
  const[message,setMessage] = useState([]);
  const[msgTxt,setMsgTxt] = useState(null);
  const[isTyping,setIsTyping] = useState(false);
  const toast = useToast();

  const socketRef = useRef(); // Use useRef to create a persistent reference to the socket

  const fetchChatMsg = useMutation({
    mutationKey:"fetch-messages",
    mutationFn:(data)=>{
      return getAllMessages(data);
    },
    onSuccess:(res)=>{
        if(res?.data){
         
          setCurrentMsg(res.data);
        }

    },
    onError:(err)=>{
     if(isAxiosError(err)){
      toast({
        title: 'fetching message failed',
        description:err?.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
     }
    }

  })


  
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_ENDPOINT);

    socketRef.current.on('connect', () => {
    });

    socketRef.current.emit('join-room', currentChat?._id);

    socketRef.current.on('receive-message', (data) => {
      setMessage((prevMsg) => [...prevMsg,data]);
    });

    socketRef.current.on("start-typing",(id)=>{
    
       if(id!=user._id && !currentChat?.isGroupChat){
        setIsTyping(true);
       }
      
    })
  socketRef.current.on("end-typing",(id)=>{
      if(id!=user._id){
        const delayedFunction=debounce(handleEndTyping,2000);
        delayedFunction();
      }
    })

    if(currentChat!=null){
      const payload = {token:JSON.parse(localStorage.getItem('token'))?.token,chatId:currentChat?._id}
      fetchChatMsg.mutate(payload);


    }
    return () => {
      socketRef.current.disconnect();
    };
  }, [currentChat]); 


 
  const scrollableContainerRef = useRef();

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
    }
  }, [message]);
  
  useEffect(()=>{
    setMessage(currentMsg)
  },[currentMsg])
  const[infoState,setInfoState]=useState(false);

  
  const handleChatInfo = (type)=>{
     if(type=="groupInfo"){
       setInfoState(true);
     }
  }
  const handleInfoCardClose=()=>{
   
    setInfoState(false);
  }
 
  const debounce = (cb,d)=>{
    let timer;
     return ()=>{
        clearTimeout(timer);
      
        timer = setTimeout(() => {
            cb();
        }, d)
    }
 }

 const handleEndTyping = ()=>{
 
    setIsTyping(false);
  
 }
  const handleChatMessage = (type,e)=>{
   
   
    socketRef.current.emit("start-typing",currentChat._id,user._id)
    if(e.code=="Enter"){
      if(msgTxt=='')return;
      if(type=="user"){
        socketRef.current.emit("send-message",{content:msgTxt,chatId:currentChat._id,sender:user._id,type:"single"})
      }
      if(type=="group"){
        socketRef.current.emit("group-message",{content:msgTxt,chatId:currentChat._id,sender:user._id,type:"group"})
      }
     
      setMsgTxt('');

    }
    socketRef.current.emit("end-typing",currentChat._id,user._id)
  }
  const handleMessageSendButton = (type)=>{
     
      if(msgTxt=='')return;
      if(type=="user"){
        socketRef.current.emit("send-message",{content:msgTxt,chatId:currentChat._id,sender:user._id,type:"single"})
      }
      if(type=="group"){
        socketRef.current.emit("group-message",{content:msgTxt,chatId:currentChat._id,sender:user._id,type:"group"})
      }
      setMsgTxt('');
  }

  return (
    <div className=' col-start-2 col-end-4 relative rounded-tr-2xl h-full w-full rounded-br-2xl'>
          <div className="w-full  h-full ">
              <div className="flex items-center h-fit justify-between gap-8 px-4 py-2 pl-6 w-full  ">
              <Avatar size='sm' src={currentChat?.isGroupChat?groupImg:currentReceiver[0].pic}/>
              <p className="justify-self-end w-full">{currentChat?.isGroupChat?currentChat.chatName:currentReceiver[0].username}</p>
              <Menu>
                <MenuButton as={IconButton} className='flex items-center cursor-pointer bg-none' colorScheme='transparant'  icon={<FaEllipsisV color='gray' size={20} />}></MenuButton>
                <MenuList>
                    <MenuItem onClick={handleChatInfo.bind(null,currentChat?.isGroupChat?"groupInfo":"userInfo")}>{currentChat?.isGroupChat?"groupInfo":"userInfo"}</MenuItem>
                </MenuList>
              </Menu>
              </div>
          <div className="w-full h-full max-h-full">
             <ScrollableFeed className="w-full bg-gray-200  " ref={scrollableContainerRef}>
             
                    {
                      message.length!=0? message?.map((msgdata)=>{
                        
                        if(msgdata.sender==user._id){
                            return <SenderChatCard message={msgdata.content} key={message._id}/>
                        }
                        else{
                          if(msgdata.type=="single"){
                            return <ReceiverChartCard message={msgdata.content} key={message._id}/>

                          }
                          if(msgdata.type=="group"){
                            const msgsender = currentChat.users?.filter((user)=>user._id==msgdata.sender); 
                              
                            return <ReceiverChartCardWithProfile content={msgdata.content} senderProfile={msgsender[0]?.pic} sender={msgsender[0]?.username} key={message._id}/>
                          }
                        }
                      }):<div className='w-full h-[90%] '></div>
                      
                    }
                   
              {isTyping&& <div className=" w-full mb-2 -ml-2 flex items-center justify-start ">
                                <span className="loader"></span>
                </div>}
              </ScrollableFeed>
              
              </div>
           
              <div className="flex items-center h-fit gap-4 z-50 bg-white sticky bottom-0 pl-4 py-4">
                  <Input type='text' placeholder='Type a Message' onKeyDown={handleChatMessage.bind(null,currentChat?.isGroupChat?"group":"user")}  value={msgTxt} onChange={(e)=>{setMsgTxt(e.target.value)}}/>
                   <IconButton onClick={handleMessageSendButton.bind(null,currentChat?.isGroupChat?"group":"user")}><IoSend/></IconButton>
              </div>
          </div>
          {infoState && <GroupInfoCard open={infoState} onClose={handleInfoCardClose}/>}
    </div>
  )
}

export default MyChat