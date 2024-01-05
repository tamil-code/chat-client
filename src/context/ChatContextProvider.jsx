import {createContext,useContext, useState} from 'react'

// import { useNavigate} from "react-router-dom";

export const ChatContext = createContext();
const ChatContextProvider = ({children}) => {
    const[user,setUser] = useState(null);
    const[userList,setUserList] = useState(null);
    const[isAuth,setAuth] = useState(false);
    const[currentChat,setCurrentChat] = useState(null);
    const[currentReceiver,setCurrentReceiver] = useState(null);
    const[currentMsg,setCurrentMsg] = useState([]);
    

  return (
   <ChatContext.Provider value={{user,setUser,userList,setUserList,isAuth,setAuth,currentChat,setCurrentChat,currentReceiver,setCurrentReceiver,currentMsg,setCurrentMsg}}>
      {children}
   </ChatContext.Provider>
  )
}


export default ChatContextProvider