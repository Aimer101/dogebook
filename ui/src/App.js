 import Home from "./pages/home/Home";
 import { useContext, useEffect, useState } from "react";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import SignUp from "./pages/signup/SignUp";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,

} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Messanger from "./pages/messanger/Messanger";
import Saved from "./pages/save/Saved";
import SinglePost from "./pages/singlePost/SinglePost";
import Notification from "./pages/notification/Notification";
import Search from "./pages/search/Search";
import axios from 'axios'
import Loading from "./pages/loadingScreen/Loading";
import socket from './socketConfig'
import ErrorPage from "./pages/errorPage/ErrorPage";





function App() {
  const {user, dispatch} = useContext(AuthContext) /* To take the global property of Authcontextprovider we use useContext */
  const [fetching, setFetching] = useState("true")

  
  useEffect(() => {
    const fetch = async() => {
      const authorization = localStorage.getItem("dabeec20c10f9238bb81")
      if(!authorization){
        return setFetching("null")
      }
      try{
        const res = await axios.get(`/auth/user`, {
          headers: {
            authorization: `BEARER ${authorization}`
          }
        })      
        user === null && dispatch({type: "LOGIN_SUCCESS", payload:res.data}) 
        socket.emit('addUser', res.data._id)
        setFetching("false")
      }catch(err){
        setFetching("null")
      }  
    }

    (localStorage.getItem("dabeec20c10f9238bb81")) ? fetch() : setFetching("null")
  }, [user, dispatch])





  return(
    <Router>
      <Switch>
        <Route exact path = "/">
        { fetching === "true" && <Loading />}
        { fetching === 'false' && <Home /> }
        { fetching === 'null' && <Redirect to ='/login' /> }

        </Route>

        <Route path = "/login" >
        { fetching === "true" && <Loading />}
        { fetching === 'false' &&  <Redirect to ='/' /> }
        { fetching === 'null' && <Login/> }
        </Route>

        <Route path = "/register" >
        { fetching === "true" && <Loading />}
        { fetching === 'false' &&  <Redirect to ='/' /> }
        { fetching === 'null' && <SignUp/> }
        </Route>

        <Route path = "/messanger" >
        { fetching === "true" && <Loading />}
        { fetching === 'false' && <Messanger /> }
        { fetching === 'null' && <Redirect to ='/login' /> }

        </Route>

        <Route path = "/saved-post" >
        { fetching === "true" && <Loading />}
        { fetching === 'false' && <Saved /> }
        { fetching === 'null' && <Redirect to ='/login' /> }

        </Route>

        <Route path = "/profile/:username" >
        { fetching === "true" && <Loading />}
        { fetching === 'false' && <Profile /> }
        { fetching === 'null' && <Redirect to ='/login' /> }
        
        </Route>

        <Route path = "/post/:postId" >
        { fetching === "true" && <Loading />}
        { fetching === 'false' && <SinglePost /> }
        { fetching === 'null' && <Redirect to ='/login' /> }
        
        </Route>

        <Route path = "/notification" >
        { fetching === "true" && <Loading />}
        { fetching === 'false' && <Notification /> }
        { fetching === 'null' && <Redirect to ='/login' /> }
         

        </Route>

        <Route path = "/search/:username" >
        { fetching === "true" && <Loading />}
        { fetching === 'false' && <Search /> }
        { fetching === 'null' && <Redirect to ='/login' /> }
        </Route>

        <Route path = "/notExist" >
        { fetching === "true" && <Loading />}
        { fetching === 'false' && <ErrorPage /> }
        { fetching === 'null' && <Redirect to ='/login' /> }
        </Route>

        <Route >
        { fetching === "true" && <Loading />}
        { fetching === 'false' && <ErrorPage /> }
        { fetching === 'null' && <Redirect to ='/login' /> }
        </Route>



      </Switch>
    </Router>
  )
}
export default App;
