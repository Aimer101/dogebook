import "./post.css"
import {FavoriteBorder, ChatBubbleOutline, BookmarkBorder, Bookmark} from "@material-ui/icons"
import { useState,useEffect, useContext } from "react"
import axios from "axios"
import {format} from "timeago.js"
import {Link, useHistory} from "react-router-dom"
import { AuthContext } from "../../context/AuthContext" 
import socket from '../../socketConfig'
import ParentChildren from "./ParentChildren"


export default function Post({post, parent, reply, username, isParent, isChildren}) {

    const [like,setLike] = useState(post?.likes.length)
    const [isLike,setisLike] = useState(false)
    const [isRebark,setisRebark] = useState(false)
    const [rebark,setRebark] = useState(post.rebarks.length)
    const [isSaved, setIsSaved] = useState(false)
    const [replyCounter, setReplyCounter] = useState(post.childrenId.length)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const {user:currentUser} = useContext(AuthContext)


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

    const saveHandler = async() => {
        try{

           axios.put(`/post/${post._id}/save`, {userId: currentUser._id})
            
        }catch(err){
            
        }

        setIsSaved(!isSaved)
    }


//-------------------------------------------- ALL PUT REQUEST ------------------------------------//

    useEffect(()=>{
        setisLike(post.likes.includes(currentUser?._id))
        setisRebark(post.rebarks.includes(currentUser?._id))
        
    }, [currentUser?._id, post.likes, post.rebarks])

    useEffect(() => {
        const fetchUser = async() => {
            const res = await axios.get(`/users?userId=${currentUser?._id}`)
            setIsSaved(res.data.savedPost.includes(post._id))


        };
        fetchUser();
    }, [currentUser?._id])


    useEffect(() => {
        reply && setReplyCounter(parent)
    }, [parent])
    







    return (<>


        <div  className = "post" >
            <div className="postWrapper">

                {post.parentPost && <ParentChildren post = {post} username = {username}/>}

                {!post.parentPost && <>
                <div className="postTop"> 

                    <div className="postTopLeft">

                        <Link to = {`/profile/${post?.userUsername}`}>
                            <img src={post?.userProfilePicture ? `${post.userProfilePicture}` : PF + "images/defaultPicture.jpg"} className="postTopLeftImg" />
                        </Link>
                        
                        <Link to = {`/profile/${post?.userUsername}`} style = {{textDecoration:"none", color: 'black'}}>
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
                    
                    <img src={post.img &&` ${post.img}`} className={post.desc? "postImg":"postImg Notext"} />
                </div>

                <div className="postBottom">
                    
                <Link to = {`/post/${post._id}`} style={{ textDecoration: 'none' , color: 'black'}}>
                        <div className= "action">
                        <ChatBubbleOutline  className = "replyIcon" /> 
                        <span className="replyCounter">{replyCounter}</span>
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
                        }
                
            </div>

        </div>
    </>)
}
