import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import {FavoriteBorder, ChatBubbleOutline, BookmarkBorder, Bookmark} from "@material-ui/icons"
import { Link, useHistory } from 'react-router-dom'
import {format} from "timeago.js"
import socket from '../../socketConfig'
import axios from "axios"
import './post.css'

export default function ParentSeparatedChildren({post, isParent, isChildren}) {
    const {user:currentUser} = useContext(AuthContext)
    const [like,setLike] = useState(post.likes.length)
    const [isLike,setisLike] = useState(post.likes.includes(currentUser?._id)) // liked?
    const [rebark,setRebark] = useState(post.rebarks.length)
    const [isRebark,setisRebark] = useState(post.rebarks.includes(currentUser?._id)) // rebarked?
    const [isSaved, setIsSaved] = useState(currentUser?.savedPost.includes(post._id)) // saved ?
    const PF = process.env.REACT_APP_PUBLIC_FOLDER

     //---------------------------------------------- ALL PUT REQUEST ------------------------------//
    const likeHandler = async() => {

        try{
            axios.put(`/post/${post?._id}/like`, {userId: currentUser._id,
                receiverId: post.userId, 
            senderId: currentUser._id, 
            itemId: post._id,
            }) 
            socket.emit(`sendNewNotification`, {receiverId: post.userId})

        }catch(err){
        }

        setLike(isLike ? like-1 : like+1)
        setisLike(!isLike)
    }

    const saveHandler = async() => {
        try{

           axios.put(`/post/${post._id}/save`, {userId: currentUser._id})
            
        }catch(err){
            
        }

        setIsSaved(!isSaved)
    }

    const rebarkHandler = async() => {
        try{

            axios.put(`/post/${post?._id}/rebark`, {userId: currentUser._id,
                receiverId: post.userId, 
            senderId: currentUser._id, 
            itemId: post._id,
            })
            socket.emit(`sendNewNotification`, {receiverId: post.userId})

            
        }catch(err){     
        }
        setRebark(isRebark ? rebark-1 : rebark+1)
        setisRebark(!isRebark)
    }

//-------------------------------------------- ALL PUT REQUEST ------------------------------------//

useEffect(()=>{
    setisLike(post.likes.includes(currentUser?._id))
    setisRebark(post.rebarks.includes(currentUser?._id))
    setIsSaved(currentUser?.savedPost.includes(post._id))
    
}, [currentUser?._id, post.likes, post.rebarks])






    return (
        <>
        <div className="postTop"> 
               
               <div className="postTopLeft">
                   <Link to = {`/profile/${post?.userUsername}`}>
                       <img src={post?.userProfilePicture ? `${post.userProfilePicture}` : PF + "images/defaultPicture.jpg"} className="postTopLeftImg" />
                   </Link>
                   <Link to = {`/profile/${post?.userUsername}`} style = {{textDecoration:'none', color: 'black'}}>

                   <span className="postUsername">{post.userFullname}</span>
                   </Link>
                   <span className="postItemDetail">@{post?.userUsername}</span>
                   <span className="postItemDetailDivider">.</span>

                   <span className="postDate">{format(post.createdAt)}</span>

               </div>

               <div className="postTopRight" onClick = {saveHandler} className = "action">{
                   isSaved ? <Bookmark className = "saveIcon" /> : <BookmarkBorder className = "saveIcon"/>
               }
                   
               </div>
           </div>
           <div className="postCenter">
               
               <span className="postText" >{post.desc}</span>  
               {
                   isChildren && post.desc && 
               <img src={post.img?` ${post.img}`: ""} className="postImg children withText" />

               }
               {
                   isChildren && !post.desc && 
                   <img src={post.img?` ${post.img}`: ""} className="postImg children" />
               }
               {
                   !isChildren &&
               <img src={post.img?` ${post.img}`: ""} className="postImg" />
               }
           </div>

           <div className={isParent? "postBottom parent" : "postBottom"}>
               
           <Link to = {`/post/${post._id}`} style={{ textDecoration: 'none' , color: 'black'}}>
                   <div className= "action">
                   <ChatBubbleOutline  className = "replyIcon" /> 
                   <span className="replyCounter">{post.childrenId.length}</span>
                   </div>
                   </Link>

                   <div className= {isRebark? "action rebarked" : "action"} onClick = {rebarkHandler}>
                       <img src={isRebark? PF+'images/ui/barked.png' :PF+'images/ui/bark.png' } alt="" className="rebarkIcon"  />
                   <span className="rebarkCounter">{rebark}</span>


                   </div>

                   <div className= {isLike ? "action liked" : "action"} onClick = {likeHandler}> 
                   <FavoriteBorder  className = "likeIcon" />
                   <span className="likeCounter">{like}</span>
                   </div>
               
               
           </div>

        </>
    )
}
