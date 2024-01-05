import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement,useToast } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

const SignUp = () => {
  const toast = useToast();
  const[show,setShow] = useState(false);
  const[loading,setLoading]=useState(false);

  const[uploadImage,setUploadedImage] = useState(null);
  const imageref = useRef(null);
  const handleClick = ()=>{
     setShow((prev)=>!prev);
  }

  const handleChooseButtonClick = ()=>{
      imageref.current.click();
      console.log('clicked');
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
      console.log(err);
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
     console.log(event.target[0].value);
     console.log(event.target[1].value);
     console.log(event.target[2].value);
    
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
          <Button variant={'solid'} type='submit' colorScheme='blue' size={'sm'} loadingText="signing in..." isLoading={loading}>SignUp</Button>
    </form>
  )
}

export default SignUp