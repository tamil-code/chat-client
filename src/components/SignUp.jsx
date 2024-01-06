import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement,useToast } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { useMutation } from 'react-query';
import { postRegister } from '../lib/axios';

const SignUp = () => {
  const toast = useToast();
  const[show,setShow] = useState(false);
  const[loading,setLoading]=useState(false);

  const[uploadImage,setUploadedImage] = useState(null);
  const imageref = useRef(null);
  const handleClick = ()=>{
     setShow((prev)=>!prev);
  }

  const signUpQuery = useMutation({
    mutationKey:"signup",
    mutationFn:(data)=>{
      return postRegister(data);
    },
    onSuccess:(res)=>{
      if(res?.data?.message=="user already found ! "){
        console.log(res);
        toast({
          title: 'user already found !',
          status: 'warning',
          duration: 4000,
          isClosable: true,
        })
        return;
      }
      else if(res?.data?.message=="User registered successfullly !"){
        toast({
          title: 'User registered successfullly !',
          status: 'success',
          duration: 4000,
          isClosable: true,
        })
        
        return;
      }
    },
    onError:(err)=>{
      console.log(err);
    }
  })
  const handleChooseButtonClick = ()=>{
      imageref.current.click();
  }
  const handleUploadImage =async (event)=>{
     try{

      setLoading(true);
     const pic = event.target.files[0];
     if(pic==undefined){
      toast({
        title: 'please select an image',
        description: "Image is not yet selected",
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      return;
     }
     if(pic.type=='image/jpeg' || pic.type=='image/png'||pic=='image/jpg'){
        const data = new FormData();
        data.append("file",pic);
        // data.append("upload_preset","chat-app");
        // data.append("cloud_name","dedipfldi");
       
        data.append("upload_preset","chat-app");
        data.append("cloud_name","dedipfldi");
       const uploadedImage = await fetch(`${import.meta.env.VITE_IMAGE_UPLOAD_ENDPOINT}/image/upload`,{
        method:"POST",
       
        body:data
       })
       const imageresponse =await uploadedImage.json();
       const imageURL = imageresponse.url.toString()
       console.log(imageURL);
       setUploadedImage(imageURL)
       toast({
        title: 'Image successfully uploaded',
        description: "profile image is uploaded successfully!",
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
       setLoading(false);;

     }
     
     }
     catch(err){
      toast({
        title: 'failed to upload the image',
        description: err.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      setLoading(false);
      return;
    }
  }
  const handleSignUpFormSubmit = (event)=>{
    event.preventDefault()
     console.log(event);
     const payload = {
      username:e.target[0].value,
      email:e.target[1].value,
      password:e.target[2].value,
      profileURL:uploadImage
     }
     signUpQuery.mutate(payload);

    
  }
  return (
    <form className='flex flex-col gap-4' onSubmit={handleSignUpFormSubmit}>
          <FormControl id='username' isRequired>
            <FormLabel size="sm">Username</FormLabel>
            <InputGroup>
            <Input variant='filled' placeholder='username'  required={true} type='text'/>
            </InputGroup>
          </FormControl>
             <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <InputGroup>
            <Input variant='filled' placeholder='email' required={true}   type='email'/>
            </InputGroup>
          </FormControl> 
          <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input variant='filled' placeholder='password'  required={true}   type={show?'text':'password'}/>
            <InputRightElement width={'4.5rem'}>
                <Button h='1rem' size='sm' onClick={handleClick}>
                  {show?'Hide':'Show'}
                </Button>
            </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl id='image' >
            <FormLabel>Upload Image</FormLabel>
            <InputGroup>
            <input type='file' ref={imageref}    onChange={handleUploadImage} className='hidden'/>
             <Button  variant='solid' size={'xs'} onClick={handleChooseButtonClick} colorScheme='blue'>choose image</Button>
            </InputGroup>
          </FormControl> 
          <Button variant={'solid'} type='submit' colorScheme='blue' size={'sm'} loadingText="signing in..." isLoading={loading} >SignUp</Button>
    </form>
  )
}

export default SignUp