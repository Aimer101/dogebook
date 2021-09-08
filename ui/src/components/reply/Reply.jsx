import {PermMedia,Cancel} from "@material-ui/icons"
import { useContext, useState, useEffect } from "react";
import { AuthContext} from "../../context/AuthContext"
import axios from 'axios'
import TextareaAutosize from 'react-textarea-autosize';
import { storage } from "../../firebaseData";
import socket from '../../socketConfig'
import './reply.css'




export default function Reply({id, person, setReplyCounter,children, setChildren, setFetching, replyCounter}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const {user} = useContext(AuthContext)
    const [desc, setDesc] = useState("")
    const [file, setFile] = useState(null)
    const [followers, setFollowers] = useState([])

    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`/users/followers/${user._id}`)
            setFollowers(res.data)
        }
        fetch()
    }, [user])

    

    const handleSubmit = async (e) => {
        setFetching(true)
        e.preventDefault();
        const newPost = {
             userId : user._id,
             desc,  
             parentId: id          
        }

        if(file){

            const name = Date.now() + file.name
            const uploadTask =  storage.ref(`images/post/${name}`).put(file)
            uploadTask.on(
                "state_changed",
                snapshot => {} ,
                error => {
                    
                },
                () => {
                    storage
                    .ref("images/post")
                    .child(name)
                    .getDownloadURL()
                    .then(async (url) => {
                         newPost.img = url
                         const res = await axios.post('/post', newPost) 
                         await axios.put(`/post/${id}/reply`, {childrenId : res.data._id})
                         setDesc("")
                        setFetching(false)
                        const respond = {
                            ...res.data,
                            userProfilePicture: user.profilePicture,
                            userUsername: user.username,
                            userFullname: user.fullname
                        }
                         setFile(null)
                         const update = [respond, ...children]
                        setChildren(update)
                        setReplyCounter(update.length)
                        socket.emit(`sendNewNotification`, {receiverId: person})
                        socket.emit('newPost', {followingUsers:followers})


                    })
                }
            )
        } 

        if(!file)
        {

            try{
                const res = await axios.post('/post', newPost) 
                await axios.put(`/post/${id}/reply`, {childrenId : res.data._id,
                    receiverId: person, senderId: user._id, itemId: id,})
                setDesc("")
                setFetching(false)
                const respond = {
                    ...res.data,
                    userProfilePicture: user.profilePicture,
                    userUsername: user.username,
                    userFullname: user.fullname
                }
                
                const update = [respond, ...children]
                setChildren(update)
                setReplyCounter(update.length)
                socket.emit('newPost', {followingUsers: followers})
                socket.emit(`sendNewNotification`, {receiverId: person})




            }catch(err){
            //Pass              
            }           
        }
    }


    return (
        <div className="shareduplicate"> 
            <div className="shareWrapper">
                <div className="shareTop"> 
                    <img src={user.profilePicture? user.profilePicture : PF + "images/defaultPicture.jpg" } alt="" className="shareProfilePicture"/>
                    <TextareaAutosize placeholder= "Write a reply" className="shareInput" value = {desc} onChange = {(e) => setDesc(e.target.value)} maxLength = "250"/>
                    
                </div>
                <hr className = "shareHr"/>
                {file && (
                    <div className="shareImgContainer">
                        <img src={URL.createObjectURL(file)} className="shareImg" alt="" />
                        <Cancel className="shareCancel" onClick = {() => setFile(null)}/>
                    </div>
                )}
                <form className="shareBottom" onSubmit = {handleSubmit}>
                    <div className="shareOptions">
                        <label className="shareOption" htmlFor="file">
                            <PermMedia style = {{fill: 'darkblue'}} className = "shareIcon"/>
                            <span className="shareOptionText">Photo</span>
                            <input style = {{display:"none"}} type="file" id="file" accept = ".png, .jpeg, .jpg" onChange = {(e) => setFile(e.target.files[0])}/>
                        </label>
                    </div>
                    
                    <button className = "shareButton" type = 'submit' disabled = {(!file && !desc) ? true : false }>Reply</button>
                </form>
            </div>
        </div>
    )
}
