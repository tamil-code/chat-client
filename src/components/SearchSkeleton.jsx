import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const SearchSkeleton = ({count}) => {
  const dummy  = new Array(count||8).fill(0);
  
  return (
    <Stack>
     {dummy.map((i,index)=>{
        return <Skeleton height="60px" key={index} />  
       
     })}
    </Stack>
  );
};

export default SearchSkeleton;
