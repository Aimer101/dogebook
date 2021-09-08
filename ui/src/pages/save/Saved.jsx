import Leftbar from '../../components/leftbar/Leftbar'
import Rightbar from '../../components/rightbar/Rightbar'
import './saved.css'
import { Helmet } from 'react-helmet'
import { CircularProgress } from "@material-ui/core"
import { useState, useEffect, useContext } from "react"
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import Post from '../../components/post/Post'





export default function Saved() {

        const [posts,setPosts] = useState([])
        const {user} = useContext(AuthContext)
        const [fetching, setFetching] = useState('true')
    
    
        /* To fetch data */
        useEffect(() => {
            const fetchPosts = async() => {
    
                    try{
                        const res = await axios.get(`/post/${user._id}/save-post`)
                        const inverse = res.data.reverse()
                        console.log(inverse);
                        setPosts([...inverse])
                        setFetching("false")
                    }catch(err){
                    }
                    
                
    
            };
            fetchPosts();
             
        }, [user])


    return (<>
            <Helmet>
            <title>

            Saved Post/Dogebook
            </title>
        </Helmet>
        
                <>
        <div className = "saveContainer">
                <Leftbar />
                {
                                <div className="notification">
                                <div className="notificationWrapper">
                                     <p className = "currentPageHome">Saved Post</p> 
                                    {fetching === "true" &&
                                        <div className = "notification-border">
                                                <CircularProgress />
                                    </div>
                                    }
                                    {
                                        posts?.length === 0 && fetching === "false"  &&
                                        <div className = "notification-border">
                        <h1 className = "pnotsave">

                        You don't saved any post 
                        </h1>
                        </div>
                                    }
                                    {posts?.length > 0 && fetching === "false" && posts.map(p => (
                                    <Post post = {p} key = {p._id} finishSaved = {true}/>
                                    )
                                    )}
                                  
                                </div>
                            </div>

                }
         <Rightbar />
            </div>
         </>
            

    </>
    )
}
