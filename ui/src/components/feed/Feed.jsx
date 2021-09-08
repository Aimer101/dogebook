import Post from "../post/Post"
import Share from "../share/Share"
import "./feed.css"
import { useState, useEffect, useContext, useRef} from "react" 
import axios from 'axios'
import { AuthContext } from "../../context/AuthContext"
import {useLocation} from 'react-router-dom';
import socket from '../../socketConfig'
import { CircularProgress } from "@material-ui/core"



export default function Feed({username, setFetching, }) {

    const [posts,setPosts] = useState([])
    const {user} = useContext(AuthContext)
    const location = useLocation()
    const [fetch, setFetch] = useState('true')
    const [newPost, setNewPost] = useState(false)
    const [followingUsers, setFollowingUsers] = useState([])
    const topPost = useRef()
    const [saved, setSaved] = useState([])


    const fetchNewPost = async() => {
        topPost.current?.scrollIntoView({behavior:"smooth"})
        setFetch('true')

        setNewPost(false)

        try{
            const res = username ?  await axios.get(`/post/profile/${username}`) : await axios.get("/post/timeline/"+ user?._id)
            setPosts(res.data.sort((p1,p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt)
            }))
            setFetch('false')
            console.log('from post');
            console.log(topPost.current);
        }catch(err){
            
        }
    }


    useEffect(() => {
        socket.on('newPost', (data) => {
            setNewPost(true)
        })

    },[])

    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`/users/followers/${user._id}`)
            setFollowingUsers(res.data)
            setSaved(res.data.savedPost)

        }
        fetch()
    }, [user])


    
    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`/users?userId=${user?._id}`)
            setSaved(res.data.savedPost)
            
        }
        fetch()
    },[user])

    /* To fetch data */
    useEffect(() => {
        const fetchPosts = async() => {

                try{
                    const res = username ?  await axios.get(`/post/profile/${username}`) : await axios.get("/post/timeline/"+ user?._id)
                    setPosts(res.data.sort((p1,p2) => {
                        return new Date(p2.createdAt) - new Date(p1.createdAt)
                    }))
                    setFetch('false')
                }catch(err){
                    
                }
            

        };
        fetchPosts();
         
    }, [username, user?._id]) 


    return (<>
            <div className = {newPost ? 'newPost' : 'newPost hidden'} onClick = {fetchNewPost}>
                <p>
                New Post
                    </p>

            </div>
        <div className={username ? "feed nop" : "feed"}>
            <div className="feedWrapper" ref = {topPost}>
                {(location.pathname === "/" ) && 
                 <p className = "currentPageHome">Home</p> 
                
                }
                
                
                {(location.pathname === "/" ) && <Share setPosts = {setPosts} posts = {posts} setFetching = {setFetching} followingUsers = {followingUsers}/> }
                
                {
                    fetch === "true" && 
                    <div style = {{ textAlign:"center", paddingTop: "100px"}}>

                    < CircularProgress style ={{color:'darkblue'}} />
                    </div>
                }
                {
                    fetch === 'false' && posts.length === 0 && 
                    <div  className = "noPost">
                        <h1>There is no post yet
                            </h1>
                    </div>
                }
                
                
                {
                fetch === 'false' && posts.map((p) => (
                    
                    <Post post = {p} key = {p._id} username = {username}/>
                    ))
                }

              
            </div>
        </div>
    </>)
}
