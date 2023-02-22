import axios from 'axios';

export const updateset=async (data,type)=>{
    try{
      const url=type==='password'?'http://127.0.0.1:3000/api/v1/user/updatepass':'http://127.0.0.1:3000/api/v1/user/updateme';
      const res=await axios({
        method:'PATCH',
        url,
        data
        }
    )
    if(res.data.status==='Success')
    console.log("Yes data is updated");
}catch(err){
    console.log("some erroe")
}
}