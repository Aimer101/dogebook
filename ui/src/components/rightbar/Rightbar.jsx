import "./rightbar.css"
import { useEffect, useState } from "react"
import {Search} from "@material-ui/icons"
import { Link, useHistory } from 'react-router-dom'; // version 5.2.0
import axios from "axios";
import { CircularProgress } from "@material-ui/core";




export default function Rightbar() {
    const [query, setQuery] = useState('')
    let history = useHistory ();
    const [user, setSuggestedUser] = useState([])
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        const fetch = async() => {
            const res = await axios.get(`/users/suggestedUser`)
            setSuggestedUser(res.data)
            setFetching(false)
        }
        fetch()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        history.replace(`/search/${query}`)
        

    }



    return (
        <>
        <div className="rightbar">
            <div className="rightbarWrapper">
                
            <form className="searchbarRightbar" onSubmit = {handleSubmit} onChange = {(e) => setQuery(e.target.value)}>
                    <Search className="searchIconChat"/>
                    <input placeholder="Search people" className="searchInputChat" />
                </form>
            
                <div className="rightbarSuggestion">
            <h2 style = {{textAlign:'left'}}>Who to follow</h2>
            {
                !fetching &&
            <Link style = {{textDecoration:"none", color: 'black'}} to = {`/profile/${user.username}`}>
            <div className = 'suggestion1'>
                <img src={user.profilePicture} className = "suggestionPic" />

                <div className="suggestionDetail">
                <h1>{user.fullname} </h1>
                <p>{user.username} </p>

                </div>
            </div>
            </Link>
            }
            {
                fetching && 
                <CircularProgress style = {{marginTop:'50px'}}/>
            
            }
            
            </div>

        </div>
        </div>
    </>
    )
}
