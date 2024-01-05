import axios from 'axios'

export const instance1 = axios.create({
    baseURL:import.meta.env.VITE_API_ENDPOINT,
    headers:{
        'Content-Type':'application/json'
    }
})

export const postLogin  = async (data)=>{
    console.log(data);
    try{
        const response = await instance1.post('/login',data)
        return response;
    }
    catch(err){
        console.log(err);
        return err;
    }
}

export const postSearchUser = async (data)=>{
    try{
        const response =await instance1.get(`/users?search=${data.text}`,{
            params:{token:data.token}
        });
        return response;
    }
    catch(err){
        console.log(err);
        return err;
    }
}

export const postAuthenticate = async (data)=>{
    try{
        const response =await instance1.post(`/authenticate`,data);
        return response;
    }
    catch(err){
        console.log(err);
        return err;
    }
}

export const getAllChats = async (data)=>{
    try{
        const response = await instance1.get('/',{
            params:{token:data}
        })
        return response;
    }
    catch(err){
        console.log(err);
        return err;
    }
}

export const postAccessChat = async (data)=>{
    try{
        const response = await instance1.post('/',{userId:data.userId},{
            params:{token:data.token}
        })
        return response;
    }
    catch(err){
        return err;
    }
}

//create a group
export const postNewGroup = async (data)=>{
    console.log(data);
    try{
        const response =await instance1.post('/new-group',{
            name:data.name,
            users:data.users
        },{
            params:{token:data.token},
        })
        return response;
    }
    catch(err){
        console.log(err);
        return err;
    }
}

//rename-group
export const postRenameGroup = async (data)=>{
    console.log(data);
    try{
        const response =await instance1.put('/rename-group',{
            chatId:data.chatId,
            chatName:data.chatName
        },{
            params:{token:data.token},
        })

        console.log(response);
    
        return response;
    }
    catch(err){
        console.log(err);
        return err;
    }
}

export const postAddToGroup = async (data)=>{
    console.log(data);
    try{
        const response =await instance1.post('/add-group',{
            chatId:data.chatId,
            userId:data.userId
        },{
            params:{token:data.token},
        })

        console.log(response);
    
        return response;
    }
    catch(err){
        console.log(err);
        return err;
    }
}

export const deleteGroup = async(data)=>{
    try{
         const response = await instance1.delete('/delete-group',{
            data:{chatId:data.chatId},
            params:{token:data.token}
         })  
         return response; 
    }
    catch(err){
        return err;
    }
}
export const deleteGroupUser = async(data)=>{
    try{
         const response = await instance1.delete('/remove-group',{
            data:{chatId:data.chatId,userId:data.userId},
            params:{token:data.token}
         })  
         return response; 
    }
    catch(err){
        return err;
    }
}
export const getAllMessages = async(data)=>{
    console.log(data);
    try{
         const response = await instance1.post('/get-message',{chatId:data.chatId},{
            params:{token:data.token}
         })  
         return response; 
    }
    catch(err){
        return err;
    }
}


