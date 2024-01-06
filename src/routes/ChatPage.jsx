import React, { useContext, useEffect } from 'react'
import Navbar from '../components/Navbar'
import MyChatList from '../components/MyChatList'
import MyChat from '../components/MyChat'
import { useNavigate } from 'react-router-dom'
import { ChatContext } from '../context/ChatContextProvider'
import { postAuthenticate } from '../lib/axios'
import { useMutation } from 'react-query'


const ChatPage = () => {
  const {user,setUser,isAuth,setAuth,currentChat} = useContext(ChatContext);

  const navigate = useNavigate();

  const authenticateQuery = useMutation({
    mutationFn:(data)=>{
      return postAuthenticate(data);
    },
    onSuccess:(res)=>{
        const authenticatedUser = res.data?.user;
        const token  = res.data?.token;
        localStorage.setItem('userInfo',JSON.stringify(authenticatedUser));
        localStorage.setItem('token',JSON.stringify({token:token}));

        // console.log(User);
         if(authenticatedUser){
           setUser(authenticatedUser);
           setAuth(true);
          
         }
       
    },
    onError:(err)=>{
      toast({
        title: err?.message,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      if(err.response.status==401){
        console.log("unauthorized");
        localStorage.clear();
        setUser(null);
       setAuth(false);
       navigate('/');
       
      }
    }
  })

  useEffect(()=>{
    setUseronRefresh();
  },[])
  const setUseronRefresh = ()=>{
    const accesstoken = JSON.parse(localStorage.getItem('token'));
    if(accesstoken){
      authenticateQuery.mutate({token:accesstoken?.token});
    }
    else{
      localStorage.clear();
      setUser(null);
     setAuth(false);
     navigate('/');
    }
    
  }

  // useEffect(()=>{
  //   setUseronRefresh();
  // },[])
  // const setUseronRefresh = ()=>{
  //   console.log("in chat page /chats");
  //   const User = JSON.parse(localStorage.getItem('userInfo'));
  //   console.log(User);
  //    if(User){
  //     console.log(User);
  //      setUser(User);
  //      setAuth(true);
  //      navigate('/chats');
  //    }
  //    else{
  //     console.log("clearring in chatPage");

  //       localStorage.clear();
  //       setUser(null);
  //      setAuth(false);
  //       navigate('/');
  //    }
  // }
  if(authenticateQuery.isLoading){
    return <div className="text-black font-bold text-3xl">
       loading...
    </div>
  } 
  return (
    <div className='w-full h-screen '>
        <Navbar/>
        <div className="w-full h-[70vh]  grid grid-cols-3 grid-rows-1  px-2 ">
              <MyChatList/>
              {currentChat?<MyChat/>:(<div className=' col-span-2   bg-gray-200 rounded-tr-2xl h-full w-full flex items-center justify-center rounded-br-2xl'>
         select a chat to start messaging
      </div>)}
        </div>
    </div>
  )
}

export default ChatPage