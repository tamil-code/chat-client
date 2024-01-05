import React from 'react'

const ReceiverChartCard = ({message}) => {
  return (
    <div className="text-sm px-4 py-2 mb-2 w-fit h-fit bg-white text-black rounded-lg  mt-2 relative before:absolute before:content-[''] before:w-3 before:h-3 ml-4 before:bg-white before:rotate-45 before: before:-left-1 before:top-4">
    {message}
    </div>
  )
}

export default ReceiverChartCard