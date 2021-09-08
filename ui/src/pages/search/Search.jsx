import './search.css'
import { Helmet } from 'react-helmet'
import { useEffect, useState} from "react";
import { useParams } from "react-router";
import Leftbar from "../../components/leftbar/Leftbar";
import Rightbar from "../../components/rightbar/Rightbar";
import axios from 'axios';
import { Link} from 'react-router-dom'; // version 5.2.0
import { CircularProgress } from '@material-ui/core';








export default function Search() {

    const username = useParams().username
    const [fetching, setFetching] = useState(true)



    const [result, setResult] = useState(null)

    useEffect(() => {
        const fetch = async() => {
            try{

                const res = await axios.get(`/users?username=${username}`)
                setResult(res.data)
                setFetching(false)
            }catch(err){
                setResult(false)
                setFetching(false)

            }

        }

        fetch()
    }, [username])


    return (
        <>

    <Helmet>
          <title>{username} - Dogebook Search/Dogebook</title>
        </Helmet>


            <div className="homeContainer">
                
            <Leftbar />
            <div className="searchResult">
                <div className="searchResultWrapper" >
                    <p className = "currentPageHome">Search Result</p>
                    
                        
                    
                            {
                                fetching === true && 
                        <div className = "notification-border search">
                                <CircularProgress />
                                </div>
                            }
                            {
                                fetching === false && !result && <>
                        <div className = "notification-border search">
                                <h1 className = "pnotsave">

                                No results for {username}
                                </h1>
                                <p className = "pnotsave">
                                The term you entered did not bring up any results. Currently only people are searchable.
                                </p>
                            </div>
                            </>
                            }
                            
                        {
                                fetching === false && result && <>
                                <div className = "huehue">
                                    <Link style = {{textDecoration:'none', color:'black'}} to = {`/profile/${username}`}>
                                    <div className = "searchResultItem">

                                <div className="searchItemLeft">
                                    <img src={result.profilePicture} className='resultImage' />
                                </div>
                                <div className="searchItemMiddle">
                                    <p className="searchFullName"> {result.fullname} </p>
                                    <p className="searchusername">{result.username} </p>
                                </div>
                                </div>
                                    </Link>
                                    </div>
                                </>
                            }
                    

                </div>
            </div>
            <Rightbar />
            </div> 

        </>
    )
}
