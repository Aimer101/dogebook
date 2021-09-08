import {Reply} from "@material-ui/icons"
import './post.css'
import ParentSeparatedChildren from './ParentSeparatedChildren'
import { Link } from "react-router-dom"




export default function ParentChildren({post, username}) {
    const {parentPost, ...other} = post
    const children = other
    const parent = parentPost


    return (
        <>  
        {parent && children && !username &&
        <>
        <Link style = {{textDecoration:"none", color: "black"}} to = {`/post/${parent._id}`}>
                        <p className = "todos" >
                            <Reply className = "todosIcon"/> 
                            <span>{children.userFullname} Replied</span>
                            </p>
        </Link>
                            <div className = "connector">
                                <div className= "line"></div>
                <ParentSeparatedChildren post = {parent} isParent = {true}/>
                </div>

                <ParentSeparatedChildren post = {children} isChildren = {true}/>
        
        </>
                }
                    
        {
        parent && children && username && <>
        <Link style = {{textDecoration:"none", color: "black"}} to = {`/post/${parent._id}`}>
        <p className = "todos" >
                            <Reply className = "todosIcon"/> 
                            <span>{children.userFullname} Replied to a post</span>
        </p>
        </Link>

                <ParentSeparatedChildren post = {children} isChildren = {true} />
        
        </>
        
        
        
        
        }
        </>
    )
}
