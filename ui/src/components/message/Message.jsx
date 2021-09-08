import "./message.css"
import {format} from "timeago.js"
import { useState,useEffect } from "react"
import axios from "axios"


export default function Message({own,msg}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [user,setUser] = useState(null)

    useEffect(() => {
        const getUser = async () => {
            try{
                const res = await axios.get(`/users?userId=${msg.senderId}`)
                setUser(res.data)
            }catch(err){
                
            }   
        }

        getUser()
    },[msg])

    



    return (
        <div className= {own ? "message own" : "message"}>
            <div className="messageTop">
                {
                    !own &&
                <img src={(user && user.profilePicture) ? user.profilePicture : PF + "images/defaultPicture.jpg"}  alt="" className="messageImg" />
                }
                <p className='messageText'>{msg.text}</p>
            </div>
            <div className="messageBtm">
            {format(msg.createdAt)}
            </div>
            
        </div>
    )
}
