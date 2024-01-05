import { Button, Input, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'

import {useMutation} from 'react-query'
import { postLogin } from '../lib/axios';
import {ChatContext} from '../context/ChatContextProvider'
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';


const Login = () => {
  const {user,setUser,isAuth,setAuth} = useContext(ChatContext);
  const[email,setEmail] = useState(null);
  const[password,setPassword] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  //global context setstate

  const loginPostQuery = useMutation({
    mutationKey:'login',
    mutationFn:(data)=>{
      return postLogin(data);
    },
    onSuccess:(response)=>{
      console.log(response);
      const {data} = response;
      if(!data?.status||isAxiosError(response)){
        toast({
          title: 'Login failed',
          description:data.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
      else{
        console.log(data);
        localStorage.setItem('token',JSON.stringify({token:data.token}))
        localStorage.setItem('userInfo',JSON.stringify(data))
        setUser(data); 
        setAuth(true);
        // navigate('/chats');
        toast({
          title: 'Login successful',
          description:data.message,
          status: 'success',
          duration: 4000,
          isClosable: true,
        })
        navigate('/chats');

      }
    },
    onError:(err)=>{
      console.log(err);
    }
  })
  const handleLogin = (e)=>{
    e.preventDefault();
    console.log(email);
    console.log(password);
    loginPostQuery.mutate({email:email,password:password})
  }

 
  return (
    <form className='flex flex-col gap-4' onSubmit={handleLogin}>
          <Input variant='filled' placeholder='email'  type='email' onChange={(e)=>{setEmail(e.target.value)}} />
          <Input variant='filled' placeholder='password'  type='password' onChange={(e)=>{setPassword(e.target.value)}} />
          <Button variant={'solid'} colorScheme='blue' size={'sm'} type='submit' loadingText="logging in..." isLoading={loginPostQuery.isLoading}>Login</Button>
    </form>
  )
}

export default Login