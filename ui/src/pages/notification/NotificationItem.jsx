import axios from 'axios'
import { useEffect, useState } from 'react'
import './notification.css'
import {format} from "timeago.js"
import { Link } from 'react-router-dom'




export default function NotificationItem({item}) {
    const [user, setUser] = useState(null)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`/users?userId=${item.senderId}`)
            setUser(res.data)
        }
        fetch()
    }, [])
    return (
        
            <Link style = {{textDecoration:'none'}} to = {item.action === 'follow'? `profile/${item.itemId}`:`/post/${item.itemId}`}>
        <div className= "notificationItemWrapper">


            
                 <>
                <div className="notificationItemLeft">
                <img src={item.userProfilePicture ? item.userProfilePicture : PF + "images/defaultPicture.jpg"} alt="" className = 'notificationItemProfilePicture'/>
            </div>
            <div className="notificationItemRight">
                {
                    item.action === "like" && <>
                    {item.userUsername} just {item.action}d your post
                    </>
                }
                {
                    item.action === "rebark" && <>
                    {item.userUsername} just {item.action}ed your post
                    </>
                }
                {
                    item.action === "reply" && <>
                    {item.userUsername} just replied to your post
                    </>
                }
                {
                    item.action === "follow" && <>
                    {item.userUsername} just followed you
                    </>
                }
                <p className="time">{format(item.createdAt)}</p>
            </div>
                </>
            
            
        </div>
            </Link>
    )
}
