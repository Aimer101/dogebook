import { CircularProgress } from '@material-ui/core'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './followingFollowers.css'
import FollowingFollowersItem from './FollowingFollowersItem'



export default function FollowingFollowers({action, user}) {
    const [item, setItem] = useState([])
    const username = useParams().username
    const [fetching, setFetching] = useState(true)


    useEffect(()=> {
        const path = action.toLowerCase()
        const fetch = async() => {

            const res = await axios.get(`/users/${path}/${user}`)
            setItem((res.data))
            setFetching(false)
        }
        fetch()
    }, [action, user])
            return (
                <div className = "followingFollowersItem" >
                    {
                        fetching && 
                        <div style = {{width:'100%'}}>

                            <CircularProgress />
                        </div>
                    }
            {
                !fetching && item.length === 0 && <p>{username} has no {action.toLowerCase()}</p>
            }
            { 
                !fetching && item.length > 0 &&item.map(i => (
                    
                    <FollowingFollowersItem item = {i}/>

                    )
                    )

                } 
         </div>
    )
}
