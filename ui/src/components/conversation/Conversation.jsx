import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import './conversation.css'
import socket from '../../socketConfig'
import {format} from "timeago.js"




export default function Conversation({conversation, currentChat, handleChange}) {
    var now = null
    const latestText = (el) => {
            if(!el){
                return
            }
            if(el.length < 32){
                return el
            }
            if(el.length >32){
                var sliced = `${el.slice(0,32)}...`
                return sliced
            } 
    }
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const {user:currentUser} = useContext(AuthContext)
    const [unreadMessage, setUnreadMessage] = useState(conversation?.unreadMessage)
    const [lastText, setLastText] = useState(latestText(conversation?.lastText))
    const [lastTime, setLastTime] = useState(null)
    const [isEmpty, setIsEmpty] = useState(false)


    
    useEffect(() => {
        !conversation.lastTime && setLastTime('')
        conversation.lastTime && setLastTime(format(conversation.lastTime))
        }, [])



    useEffect(() => {
        if(!lastText && conversation.creator !== currentUser._id){
            setIsEmpty(true)
        }
        if(lastText){
            setIsEmpty(false)
        }
    }, [lastText])
    



    useEffect(() => {
        currentChat === conversation?._id && setUnreadMessage(0)
        now = currentChat === conversation?._id
        socket.on(`${conversation?._id}`, async(data) => {
            setLastText(latestText(data.text))
            setLastTime(format(Date.now()))
            handleChange(conversation._id)
            

            if(currentChat === data.conversationId){
                axios.put(`/message/${currentChat}`, {otherPerson: currentUser._id})
                setUnreadMessage(0)
            }

            
            if(now === false && data.receiverId === currentUser._id){
                setUnreadMessage((prev) => prev + 1)
            }

        } 
        )
        
    }, [currentChat])


    return (
        <div className= {!isEmpty ? "conversation" : "conversation empty"}>
            <div style = {{display: 'flex', alignItems:'center'}}>

            <img src={conversation?.userProfilePicture  ? conversation.userProfilePicture :  PF + "images/defaultPicture.jpg"} alt="" className="conversationImg" />
            <div className = "middlePa">
            <span className="conversationName">{conversation?.userUsername}</span>
            <span className = "oh">{lastText}</span>
            </div>
            </div>
            <div className="rightPa">
            <span className = "Date">{lastTime}</span>
            {
                unreadMessage > 0 &&
            <div style = {{width: '100%', display: 'flex', justifyContent:'flex-end', }}>
            <span className = "unreadMessage">{unreadMessage}</span>
                </div>
            }
            </div>

            
        </div>
    )
}
