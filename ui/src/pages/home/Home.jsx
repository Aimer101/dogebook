import Leftbar from "../../components/leftbar/Leftbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css";
import {useContext, useState, useEffect} from "react";
import { AuthContext } from "../../context/AuthContext";
import { Helmet } from 'react-helmet'
import LoadingCircular from "../loadingScreen/LoadingCircular"






export default function Home() {
    const {user} = useContext(AuthContext)
    const [fetching, setFetching] = useState(false)











    
    return (<>

            {
                fetching && <LoadingCircular />
            }
            <Helmet>
                  <title>Home/Dogebook</title>
                </Helmet>

            {user &&
                       
                <div className="homeContainer">
                        
                    <Leftbar />
                    <Feed setFetching = {setFetching}/> 
                    <Rightbar />
                    </div> 
                }
            
                    </>

    )
}
