import React, { useContext, useEffect } from 'react'

import {
  createBrowserRouter,
  RouterProvider,
 
} from "react-router-dom";
import Root from './routes/Root';
import ChatPage from './routes/ChatPage';
import PrivateRouter from './routes/PrivateRouter';

import { instance1, postAuthenticate } from './lib/axios';
import { ChatContext } from './context/ChatContextProvider';
import { useMutation } from 'react-query';
import axios from 'axios';

const App = () => {


const router = createBrowserRouter([
  {
    path: "/",
    element:<Root/>,
  }, 
   {
    path: "/chats",
    element:<ChatPage/>,
 
  },
]);

  return (
    <div className='h-full w-full'>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App