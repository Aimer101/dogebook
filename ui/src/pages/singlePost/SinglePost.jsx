import Leftbar from '../../components/leftbar/Leftbar'
import './singlePost.css'
import { useParams } from "react-router";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Post from '../../components/post/Post';
import Rightbar from '../../components/rightbar/Rightbar';
import Reply from '../../components/reply/Reply';
import { useHistory } from 'react-router-dom';
import LoadingCircular from "../loadingScreen/LoadingCircular"
import { CircularProgress } from '@material-ui/core';
import { AuthContext } from '../../context/AuthContext';


export default function SinglePost() {
    const postId = useParams().postId
    const [post, setPost] = useState(null)
    const [children, setChildren] = useState([])
    const history = useHistory()
    const [fetching, setFetching] = useState(false)
    const [fetchingPost, setFetchingPost] = useState(true)
    const [replyCounter, setReplyCounter] = useState(0)





    useEffect(() => {
        const fetchPost = async () => {
            try{
                const res = await axios.get(`/post/${postId}`)
                const {childrenPost, ...other} = res.data
                setPost(other)
                setChildren(childrenPost.reverse())
                setReplyCounter(childrenPost.length)
                setFetchingPost(false)
            }catch(err){
                history.push('/notexist')
            }
        }
        fetchPost()
    }, [postId])


    return (<>
    
        
    {
        fetchingPost && 
        <div className = 'loadingFetching'>
            <CircularProgress />
        </div>
    }
                     {
fetching &&  <LoadingCircular /> 
}
            <div className = 'postContainer' >
            <Leftbar />
            <div className="feed">
            <div className="replyWrapper" >
                 <p className = "currentPageHome">Bark</p> 



            {

                post &&  
                <div style = {{width: '100%'}} >

                <Post  post = {post} reply = {true} parent = {replyCounter}/> 
                </div>
                

            }
            {post && 
                <div className="replyBox">

                 <Reply setReplyCounter = {setReplyCounter} replyCounter = {replyCounter} setFetching= {setFetching} id = {post._id} person = {post.userId} className = "replyBox" children = {children} setChildren = {setChildren}/>
                </div>
            }
            {
                children && children.map(c => 
                   c&& <Post post = {c} key = {c._id} />
                )
            }


            
              
            
            </div>
        </div>
            
            
            <Rightbar />   
        </div>
    </>)
}
