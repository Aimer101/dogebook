import { CameraAlt } from '@material-ui/icons'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from "../../context/AuthContext"
import './miniProfile.css'
import { storage } from "../../firebaseData";
import axios from 'axios'
import { CircularProgress } from '@material-ui/core';



export default function MiniProfile({toEdit, setIsEdit}) {

    const {user, dispatch} = useContext(AuthContext)

    const [fullname, setFullname] = useState(user?.fullname)
    const [city, setCity] = useState(user?.city)
    const [birthday, setBirthday] = useState(user?.birthday)
    const [profilePicture, setProfilePicture] = useState(null)
    const [coverPicture, setCoverPicture] = useState(null)
    const [fetching, setFetching] = useState(false)

    
    useEffect(() => {
        if(!toEdit){
            setProfilePicture(null)
            setFullname(user.fullname)
            setCity(user.city)
            setBirthday(user.birthday)
            setCoverPicture(null)
        }
    }, [toEdit])

    const handleClick = async() => {
        setFetching(true)

        var edittedProfile = {
            fullname,
            city,
            birthday
        }
        if(!coverPicture && !profilePicture){
            axios.put(`/users/edit/${user._id}`, edittedProfile)

            setIsEdit(true)
        }
        if(coverPicture){
            const name = Date.now() + coverPicture.name
            const uploadTask =  storage.ref(`images/coverPhoto/${name}`).put(coverPicture)
            uploadTask.on(
                "state_changed",
                snapshot => {} ,
                error => {
                   
                },
                () => {
                    storage
                    .ref("images/coverPhoto")
                    .child(name)
                    .getDownloadURL()
                    .then(async (url) => {
                        
                         edittedProfile.coverPicture = url
                        !profilePicture &&  axios.put(`/users/edit/${user._id}`, edittedProfile)
                        setIsEdit(true)


                    })
                }
            )
        }
        if(profilePicture){
            const name = Date.now() + profilePicture.name
            const uploadTask =  storage.ref(`images/profile picture/${name}`).put(profilePicture)
            uploadTask.on(
                "state_changed",
                snapshot => {} ,
                error => {
                    
                },
                () => {
                    storage
                    .ref("images/profile picture")
                    .child(name)
                    .getDownloadURL()
                    .then(async (url) => {
                        edittedProfile.profilePicture = url
                        axios.put(`/users/edit/${user._id}`, edittedProfile)
                        setIsEdit(true)

                    })
                }
            )

        }
    }

    
    return (<>
    {
        fetching && 
        <div style = {{height: "100%", paddingTop:"40%"}}>

            <CircularProgress />
        </div>
    }
    {
        !fetching &&
    
            <div className={"miniProfileWrapper"}>
                <button className = "saveEditProfile" onClick = {handleClick}>Save</button>
                <div className="miniProfileImages">
                        
                        <img src={coverPicture ? URL.createObjectURL(coverPicture) : user?.coverPicture} alt="" className = "miniProfileCoverImg"/>
                        <input style = {{display:"none"}} type="file" id="cp" accept = ".png, .jpeg, .jpg" onChange = {(e) => setCoverPicture(e.target.files[0])}/>
                <label className = "changeCover" htmlFor = "cp"><CameraAlt style = {{color: 'white'}}/></label>
                        
                        <img src={profilePicture ? URL.createObjectURL(profilePicture) : user?.profilePicture} alt="" className="miniProfilePicture" />
                        <label className = "changePP" htmlFor = "pp"><CameraAlt style = {{color: 'white'}}/></label>
                    <input style = {{display:"none"}} type="file" id="pp" accept = ".png, .jpeg, .jpg" onChange = {(e) => setProfilePicture(e.target.files[0])}/>
                        
                </div>

                <div className="miniProfileForm">
                    <div style = {{position : 'relative'}} className = 'nameParent'>
                    <label htmlFor = "fullname" className = 'namelabel'>Name</label>
                <input type="text" id = "fullname" value = {fullname} className = "name" maxLength = '50' onChange = {(e) => setFullname(e.target.value)}/>
                    </div>

                    <div style = {{position : 'relative'}} className = 'nameParent'>
                    <label htmlFor = "location" className = 'namelabel'>Location</label>
                <input type="text" id = "location"  value = {city} className = "name" onChange = {(e) => setCity(e.target.value)}/>
                    </div>

                    <div style = {{position : 'relative'}} className = 'nameParent'>
                    <label htmlFor = "dob" className = 'namelabel'>Date of Birth</label>
                <input type="date" id = "dob"  className = "name" value={birthday} onChange = {(e) => setBirthday(e.target.value)}/>
                    </div>
                

                </div>
            </div>
            }
</>
    )
}
