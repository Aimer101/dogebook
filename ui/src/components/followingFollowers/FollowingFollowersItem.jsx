import './followingFollowers.css'
import {Link} from "react-router-dom"


export default function FollowingFollowersItem({item}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER


    return (
        <div className = "followingFollowersDetail">
                    <Link to = {`/profile/${item.username}`} >

            <img src={item.profilePicture? `${item.profilePicture}` : PF + "images/defaultPicture.jpg"} alt=""  className="followingFollowersImg"/>
            </Link>
            <div className="followingFollowersUsername">
                <p className="detail1">
                {item.username} 

                </p>
                <p className="detail2">

                {item.fullname}

 
                </p>              
                </div>  
        </div>
    )
}
