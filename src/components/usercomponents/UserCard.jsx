import { Avatar } from '@chakra-ui/react'
import React from 'react'

const UserCard = ({img,name,onclick}) => {
  return (
    <div className='hover:bg-[#30A3E6] cursor-pointer items-center bg-white drop-shadow-lg rounded-md border border-solid flex gap-4 px-2 py-1' onClick={onclick}>
        <Avatar size='md' src={img}/>
        <p className="capitalize font-sans font-medium text-xl">{name}</p>
    </div>
  )
}

export default UserCard