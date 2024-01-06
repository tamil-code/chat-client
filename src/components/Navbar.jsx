import {
  Avatar,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { SearchIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useContext, useState} from "react";
import SideDrawer from "./SideDrawer";
import {useNavigate} from 'react-router-dom'
import { ChatContext } from "../context/ChatContextProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const {user,setAuth,setUser} = useContext(ChatContext);
  const [open, setOpen] = useState(false);
  const[profileOpen,setProfileOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleMyProfile = ()=>{
    setProfileOpen(true);
  }
  const handleLogout = ()=>{
    localStorage.clear();
    setAuth(false);
    setUser(null);
    navigate('/')
  }
  const handleProfileClose =()=>{
    setProfileOpen(false);
  }
  if(user==null){
    return (
      <div className="">
         loading....
      </div>
    )
  }

  return (
    <div className="pt-3 mb-2 px-4 h-[7vh]">
      <SideDrawer open={open} handleClose={handleClose} />
      <div className="flex items-center justify-between">
        <section className="cursor-pointer" onClick={handleOpen}>
          <InputGroup className="w-fit" width={"fit-content"}>
            <InputLeftElement>
              <SearchIcon />
            </InputLeftElement>
            <Input type="text" variant="flushed" placeholder="search a user" />
          </InputGroup>
        </section>
        <span className="font-semibold text-lg">Tamil's chat app</span>
        <section className="flex items-center gap-5">
          <BellIcon boxSize={8} />
          <Menu className='cursor-pointer'  >
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size={'sm'} >
              <div className="cursor-pointer flex items-center ">
              {user?.pic?<Avatar size={'xs'}  src={user.pic}/>:<Avatar size={'xs'} />}
              </div>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleMyProfile}>My Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </section>

        <Modal isOpen={profileOpen} onClose={handleProfileClose}>
            <ModalOverlay/>
            <ModalContent>
               <ModalHeader>My Profile</ModalHeader>
               <ModalBody>
                   <div className="my-6">
                   <div className="cursor-pointer flex items-center w-full justify-center ">
               {user?.pic?<Avatar size={'xl'}  src={user.pic}/>:null}
              </div>
              <p className="bold text-center text-2xl font-bold mt-4">{user.username}</p>
                   </div>
               </ModalBody>
            </ModalContent>
        </Modal>
      </div>
      
    </div>
  );
};

export default Navbar;
