import React from 'react'

import styles from './chatcard.module.css'
const SenderChatCard = ({message}) => {
  return (
    <div className="text-sm px-4 py-2 w-fit h-fit bg-blue-500 mt-2 text-white rounded-lg relative before:absolute ml-auto mr-4 before:content-[''] before:w-3 before:h-3 before:bg-blue-500 before:rotate-45 before: before:-right-0.5 before:top-4">
    {message}
    </div>
  )
}

export default SenderChatCard