import "./share.css";
import {PermMedia,Cancel} from "@material-ui/icons"
import { useContext, useState} from "react";
import { AuthContext } from "../../context/AuthContext"
import axios from 'axios'
import TextareaAutosize from 'react-textarea-autosize';
import { storage } from "../../firebaseData";
import socket from '../../socketConfig'
import { Link } from "react-router-dom";




export default function Share({setPosts, posts , setFetching, followingUsers }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const {user} = useContext(AuthContext)
    const [desc, setDesc] = useState("")
    const [file, setFile] = useState(null)


    

    const handleSubmit = async (e) => {
        setFetching(true)
        e.preventDefault();
        const newPost = {
             userId : user._id,
             desc,           
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
                         const item = {...res.data, 
                            userProfilePicture: user.profilePicture, 
                            userFullname: user.fullname,
                            userUsername: user.username,}
                            setDesc("")
                            setFile(null)
                            setFetching(false)
                        setPosts([item, ...posts])

        
                        socket.emit('newPost', {followingUsers})
                    


                    })
                }
            )
        }

        if(!file)
        {

            try{
                const res = await axios.post('/post', newPost)
                const item = {...res.data, 
                    userProfilePicture: user.profilePicture, 
                    userFullname: user.fullname,
                    userUsername: user.username,}
                    setDesc("")
                    setFetching(false)
                setPosts([item, ...posts])

                socket.emit('newPost', {followingUsers})


            }catch(err){
                
            }
            
        }




    }

  
    return (
        <div className="share"> 
            <div className="shareWrapper">
                <div className="shareTop"> 
                <Link style = {{textDecoration:'none'}} to = {`/profile/${user.username}`}>
                    <img src={user?.profilePicture? user.profilePicture : PF + "images/defaultPicture.jpg" } alt="" className="shareProfilePicture"/>
                </Link>
                    <TextareaAutosize placeholder= "What's happening?" className="shareInput" value = {desc} onChange = {(e) => setDesc(e.target.value)} maxLength = "250"/>
                   
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
                    <button className = "shareButton" type = 'submit' disabled = {(!desc && !file) ? true : false }>Bark</button>
                </form>
            </div>
        </div>
    )
}
