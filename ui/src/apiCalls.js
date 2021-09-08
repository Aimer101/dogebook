import axios from 'axios'

export const loginCall = async(userCredentials,dispatch) => {
      
     dispatch({type:"LOGIN_START"})
     try{ 
        const res = await axios({
         method: "POST",
         data: userCredentials,
         withCredentials: true,
         url: 'auth/login',
       })

       console.log(res)

       const authenticatedUser = await axios({
         method: "get",
         withCredentials: true,
         url: 'auth/user',
       })

       
        
        dispatch({type: "LOGIN_SUCCESS", payload:authenticatedUser.data})
     }catch(err){
        dispatch({type: "LOGIN_FAILURE", payload:err})

     }
}