import './notification.css'
import Leftbar from '../../components/leftbar/Leftbar'
import Rightbar from '../../components/rightbar/Rightbar'
import { Helmet } from 'react-helmet'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import NotificationItem from './NotificationItem'
import axios from 'axios'
import { CircularProgress } from '@material-ui/core'




export default function Notification() {
    const [notification, setNotification] = useState([])
    const [fetch, setFetch] = useState('true')
    const {user} = useContext(AuthContext)
    
    useEffect(() => {
        const fetch = async() => {

            const res = await axios.get(`/notifications/${user._id}/all`)
                setNotification(res.data.reverse())
                setFetch('false')
        }
        fetch()
    }, [])

    return (<>
        
            <Helmet>
            <title>

            Notification/Dogebook
            </title>
        </Helmet>
        
             
            <div className = "notificationContainer">
            

            <Leftbar />
            <div className="notification">
            <div className="notificationWrapper">
                 <p className = "currentPageHome">Notification</p> 
                 {
                     fetch === "true" && 
                     <div className = 'notification-border'>
                     <CircularProgress />
                     </div>

                 }
                 {
                     notification.length === 0 && fetch === 'false' &&
                 <div className = "notification-border">
                        <h1 className = "pnotsave">

                        You don't have any new notification
                        </h1>
                        </div>
                }
                 {notification.length > 0 && fetch === 'false' &&
                     <div className = 'notification-border-main'>
                         {notification.map(item => <NotificationItem item = {item} key = {item._id}/>)}




                     </div>

                 }

                
              
            </div>
        </div>
           <Rightbar /> 
           </div>
            
        

            
        
    </>)
}
