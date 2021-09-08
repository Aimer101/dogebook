import"./leftbar.css";
import {HomeOutlined, EmailOutlined,NotificationsOutlined, PersonOutlineOutlined, BookmarkBorder, LockOpen} from "@material-ui/icons"
import { Link, useHistory, useLocation } from "react-router-dom";
import { useState,useEffect, useContext, useRef } from "react"
import { AuthContext } from "../../context/AuthContext";
import axios from "axios"
import socket from '../../socketConfig'







export default function Leftbar() {
    const location = useLocation(); 
    const {user, dispatch} = useContext(AuthContext)
    const [notification, setNotification] = useState(0)
    const history = useHistory()


    useEffect(() => {
        socket.on('getNewNotification', async() => {

            const res = await axios.get(`/notifications/${user._id}`)

            setNotification(res.data)
        })
    }, [])



    const handleClick = () => {
        setNotification(0)
        axios.put(`/notifications/${user?._id}`)
    }

    const handleLogout = async() => {
        dispatch({type: "LOGOUT"})
        localStorage.removeItem('dabeec20c10f9238bb81')
        
    }

    return (
        <div className="leftbar"> 
        
            <div className = "logoContainer">

            <div className="logo1" onClick = {() => {history.push('/')}}>Dogebook</div>

            </div>


            <div className="leftbarWrapper">
                <ul className="sidebarList">
                    <Link to="/" style = {{textDecoration:"none"}}>
                    <li className={location.pathname === '/' ? "sidebarListItem current" : "sidebarListItem"}>
                        <HomeOutlined className="sidebarIcon" />
                        <span className="sidebarListItemText" >Home</span>
                    </li>
                    
                    </Link>
                        <Link to="/messanger" style = {{textDecoration:"none"}}>
                    <li className={location.pathname === '/messanger' ? "sidebarListItem current" : "sidebarListItem"}>

                        <EmailOutlined className="sidebarIcon" className="sidebarIcon"  />
                        <span className="sidebarListItemText" >Message</span>
                    </li>
                        </Link>

                        <Link to="/notification" style = {{textDecoration:"none"}}>   
                    <li className="sidebarListItem" onClick = {handleClick} className={location.pathname === '/notification' ? "sidebarListItem current" : "sidebarListItem"}>
                        <NotificationsOutlined className="sidebarIcon"/>
                        {(notification > 0 )  && <span className="notificationIconBadge">{notification}</span>}
                        <span className="sidebarListItemText">Notification</span>
                    </li>
                    </Link>

                    <Link to = {`/profile/${user?.username}`} style = {{textDecoration:"none"}}>
                    <li className={location.pathname === `/profile/${user?.username}` ? "sidebarListItem current" : "sidebarListItem"}>
                        <PersonOutlineOutlined className="sidebarIcon" />
                        <span className="sidebarListItemText">Profile</span>
                    </li>
                    </Link>
                    
                    <Link to="/saved-post" style = {{textDecoration:"none"}}>
                        
                    <li className={location.pathname === `/saved-post` ? "sidebarListItem current" : "sidebarListItem"}>
                        <BookmarkBorder className="sidebarIcon"/>
                        <span className="sidebarListItemText">Saved</span>
                    </li>
                    </Link>

                    <li className="sidebarListItem" onClick = {() => handleLogout()}>
                        <LockOpen className="sidebarIcon"/>
                        <span className="sidebarListItemText">Logout</span>
                    </li>
                </ul>
                
                
            </div>
        </div>
    )
}
