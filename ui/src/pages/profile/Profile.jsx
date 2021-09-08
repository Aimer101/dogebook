import "./profile.css"
import Leftbar from "../../components/leftbar/Leftbar";
import Rightbar from "../../components/rightbar/Rightbar";
import Feed from "../../components/feed/Feed";
import axios from "axios"
import { useState,useEffect, useContext } from "react"
import { useParams } from "react-router";
import { Cake, Room, Today } from "@material-ui/icons";
import FollowingFollowers from "../../components/followingFollowers/FollowingFollowers";
import {Close} from "@material-ui/icons"
import { AuthContext } from "../../context/AuthContext";
import MiniProfile from "../../components/miniProfile/MiniProfile"
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";






export default function Profile() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    
    const [user, setUser] = useState({}) // owner of the current profile
    const username = useParams().username // username
    const [following,setFollowing] = useState(0) // that owner following count
    const [followers,setFollowers] = useState(0) // that owner followers count
    const [toDisplay, setToDisplay] = useState("") // display the follow or unfollow count
    const [toEdit, setToEdit] = useState(false) // display the edit tab
    const {user:currentUser, dispatch} = useContext(AuthContext) // current user
    const [isFollow, setIsFollow] = useState(false) // does this particular user is in our following list
    const [birth, setBirth] = useState('') // owner's birthday
    const [join, setJoin] = useState('') // owner's time joinging 
    const [isEdit, setIsEdit] = useState(false) // do we finish our 
    const history = useHistory()
    const [fetching, setFetching] = useState(true)




    const displayBirthday = (item) => {
        const month = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
        const myArr = item.split("-").reverse()
        const montha = month[parseInt(myArr[1])-1]
        setBirth(montha + " "+ myArr[0]+ ", "+ myArr[2]);

    }

    const since = (item) => {
        const month = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]

        const str = item.substring(0,7)
        const beforesplit = str.split("-").reverse()
        const montha = month[parseInt(beforesplit[0]) - 1]
        setJoin(montha + " "+ beforesplit[1])
    }


    const handleClick = async() => {
        isFollow ? axios.put(`/users/${user._id}/unfollow`, {userId: currentUser._id}) :   axios.put(`/users/${user._id}/follow`, {userId: currentUser._id})
        if(!isFollow){
            axios.post(`/notifications/`, {receiverId: user._id, senderId: currentUser._id, action: 'follow',itemId: currentUser.username })
        }else{
            axios.delete(`/notifications/${user._id}/${currentUser._id}/follow/${username}/delete`)

        }
        isFollow ? setFollowers(followers -1 ) :  setFollowers(followers + 1 )
        setIsFollow(!isFollow)
    }


    useEffect(() => {
        const fetchUser = async() => {
            try{

                const res = await axios.get(`/users?username=${username}`)
                setUser(res.data)
                displayBirthday(res.data.birthday)
                since(res.data.createdAt)
                setFollowing(res.data.following.length)
                setFollowers(res.data.followers.length)
                currentUser?.username !== username && setIsFollow(res.data.followers.includes(currentUser?._id))
                setFetching(false)
            }catch(err){
                history.push('/notexist')
            }
        };
        fetchUser(); 
        
    }, [username])

    useEffect(() => {
        const fetchUser = async() => {
           const res = await axios.get(`/auth/edit/${currentUser.username}`)
           const {accessToken, ...other} = res.data
           localStorage.setItem('dabeec20c10f9238bb81', accessToken)
           window.location.reload()

        };

        isEdit && fetchUser()

    }, [isEdit])


   


    return (<>

        <Helmet>
            <title>
            
            {user ? user.fullname : 'loading'}
            </title>
        </Helmet>


        
        <div className="profile">
        <Leftbar />

        {/* -------------------------------------------------------SHOW THE FOLLOW UNFOLLOW BAR --------------------------- */} 
        <div className={toDisplay ? "modalBox" : "modalBox hide"} onClick = {() => setToDisplay("")} style = {{cursor: "pointer"}}>
            
        <div className="modalContent">
            <div className="modalContentWrapper">
            <div className="followingFollowersTop">
            <p className = "followingFollowersTitle"> {toDisplay} </p>
            <Close onClick = {() => setToDisplay("")} style = {{cursor: "pointer"}}/>
            </div>

            </div>
            <div className="followingFollowersBtm">

            <FollowingFollowers user = {user._id} action = {toDisplay}/>

            </div>
        
        
        

        </div>
        </div> 
        {/* -----------------------------------------------SHOW FOLLOW UNFOLLOW----------------------------------------------------------------- */}


        {/* -------------------------------------EDIT Profile ----------------------------- */}
        <div className={toEdit ? "editProfileBox" : "editProfileBox hide"} >
            
        <div className="editProfileContent">
            <div className="modalContentWrapper">
            <div className="followingFollowersTop">
            <p className = "followingFollowersTitle"> Edit Profile </p>
            <Close onClick = {() => setToEdit(!toEdit)} style = {{cursor: "pointer"}}/>
            </div>

            </div>
            <div className="miniProfileBtm">
            
                <MiniProfile toEdit = {toEdit} setIsEdit = {setIsEdit} /> 


            </div>
        
        
        

        </div>
        </div> 
        {/* -----------------------------------------------EDIT PROFILE - --------------------------- */}
        
        <div className="profileRight">
            <div className="profileRightTop">
                <div className="profileCover">
                <img src={user?.coverPicture ? `${user.coverPicture}` : PF + "images/defaultCover.jpg"} alt=""  className="profileCoverImage"/>
                <img src={user?.profilePicture? `${user.profilePicture}` : PF + "images/defaultPicture.jpg"} alt=""  className="profileImg"/>
                {
                    (currentUser?.username !== username) &&  <button className="follow" onClick = {handleClick}>{isFollow? "Unfollow" : "Follow"}</button>

                }

                {
                    (currentUser?.username === username) &&  <button className="follow" onClick = {() => setToEdit(!toEdit)}>Edit Profile</button>

                }   
                </div>
                
                <div className="profileInfo">
                    
                    <p className = "profileUsername">{user.fullname}</p>
                    <p className = "profilename">@{user.username}</p>
                </div> 
                <div className="profileDetail">
                    <div className="profileDetailItem">
                    <Room />
                    <span >{user.city}</span>
                    </div>

                    <div className="profileDetailItem">
                    <Cake style = {{marginRight: '5px'}}/>
                    <span >{birth}</span>
                    </div>

                    <div className="profileDetailItem">
                    <Today style = {{marginRight: '5px'}}/>
                    <span>Joined {join}</span>
                    </div>

                    
                </div>
                    <div className="profileStats">
                    <span className="following" onClick = {() =>setToDisplay("Following")}><span className = "number">{following}</span> Following </span>
                    <span className="followers" onClick = {() =>setToDisplay("Followers")}><span className = "number">{followers}</span>  Followers</span>
                </div>

                

            </div>

            
            <div className="profileRightBottom">
            <Feed username = {username}/>
            </div>

        </div>

        <Rightbar />

        
        
        </div>
    
    
        </>
    )
}
