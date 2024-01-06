import {  Container,Tab,TabList,TabPanels,TabPanel,Tabs, useToast } from "@chakra-ui/react";
import React, { useContext,useEffect } from "react";
import Login from "../components/Login";
import SignUp from '../components/SignUp';

import {  useNavigate } from "react-router-dom";
import { ChatContext } from "../context/ChatContextProvider";
import { useMutation } from "react-query";
import { postAuthenticate } from "../lib/axios";


const Root = () => {
  
  const {user,setUser,isAuth,setAuth} = useContext(ChatContext);
 
  //toaster
  const toast = useToast();
  const navigate = useNavigate();

  const authenticateQuery = useMutation({
    mutationFn:(data)=>{
      return postAuthenticate(data);
    },
    onSuccess:(res)=>{
        const authenticatedUser = res.data?.user;
        const token = res.data?.token;
        localStorage.setItem('userInfo',JSON.stringify(authenticatedUser));
        localStorage.setItem('token',JSON.stringify({token:token}));

        // console.log(User);
         if(authenticatedUser){
          console.log(authenticatedUser);
           setUser(authenticatedUser);
           setAuth(true);
           navigate('/chats');
         }
       
    },
    onError:(err)=>{
      toast({
        title: err?.message,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      if(err.message=="Network Error"){
        toast({
          title: 'Network Error',
          description:"check the internet connection !",
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
      
      if(err.response.status==401){
        toast({
          title: 'Unauthorized',
          description:"please login to continue chat!",
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
        console.log("unauthorized");
        localStorage.clear();
        setUser(null);
       setAuth(false);
       
      }

      
    }
  })

  useEffect(()=>{
    setUseronRefresh();
  },[])
  const setUseronRefresh = ()=>{
    const accesstoken = JSON.parse(localStorage.getItem('token'));
    authenticateQuery.mutate({token:accesstoken?.token});
    
  }
  // const navigate = useNavigate();.

  
    // useEffect(()=>{
    //     const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    //     setUser(userInfo);
    //     if(!userInfo){
    //         navigate('/')
    //     }
    // },[])
  
    // if(authenticateQuery.isLoading){
     
    //   return <div className="text-black font-bold text-3xl">
    //      loading...
    //   </div>
    // }
   
  return (
    <div className="bg-white text-black w-full h-full">
      <Container maxW={"xl"} mt={"1rem"} centerContent="true">
        <div className=" min-w-[500px] max-w-fit  text-center     px-4 py-1.5 rounded-md">
          <span className="text-black font-medium text-xl">T's chat app</span>
        </div>
        <div className="shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] px-4 py-1.5 rounded-md min-w-[500px] max-w-fit mt-4 pt-4 ">
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList>
              <Tab width={'50%'} fontSize={'20px'}>Login</Tab>
              <Tab width={'50%'}  fontSize={'20px'}>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                 <Login/>
              </TabPanel>
              <TabPanel>
                 <SignUp/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default Root;
