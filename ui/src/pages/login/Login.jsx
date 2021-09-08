import "./login.css"
import { useRef, useContext, useState} from "react"
import { AuthContext } from "../../context/AuthContext"
import {CircularProgress} from "@material-ui/core" 
import axios from 'axios'
import { Helmet } from "react-helmet"
import { Link, useHistory} from "react-router-dom"

export default function Login() {

    const email = useRef()
    const password = useRef()
    const {isFetching, dispatch} = useContext(AuthContext) /* To take the global property of Authcontextprovider we use useContext */
    const [notMatch, setNotMatch] = useState(false)
    const history = useHistory()






    const handleClick = async(e) => {
        e.preventDefault()
        const userCredentials = {email: email.current.value, password: password.current.value}
        dispatch({type:"LOGIN_START"})
        try{ 
             const res = await axios({
              method: "POST",
              data: userCredentials,
              withCredentials: true,
              url: 'auth/login',
            })
            const {accessToken, ...other} = res.data

         
             dispatch({type: "LOGIN_SUCCESS", payload:other})
             localStorage.setItem('dabeec20c10f9238bb81', accessToken)
             history.push("/")
          }catch(err){
              setNotMatch(true)
             dispatch({type: "LOGIN_FAILURE", payload:err})
     
          }
         
    }

    

    return (<>

<Helmet>
                  <title>Login on Dogebook/Dogebook</title>
                </Helmet>

        <div className={notMatch ? "loginError errorMsg" : 'loginError'} onClick = {() => setNotMatch(false)}>
                <div></div>
                <p >Incorrect Username / Password</p>
                <div></div>
            </div>
        <div className = "login">
            <div className="loginWrapper">
                
                <div className="loginLeft">
                <h3 className="loginLogo">Dogebook</h3>
                <span className="loginDesc">Bark and connect with people all over the world on Dogebook</span>                
                </div>

                <div className="loginRight">

                    <form className="loginBox" onSubmit={handleClick}>
                        <div className = 'loginItem'>
                        <label htmlFor="loginEmail" className = "loginLabel">Email</label>
                        <input  type="email" className="loginInput"  ref = {email} required id = 'loginEmail'/>
                        </div>

                        <div className = 'loginItem'>
                        <label htmlFor="loginPassword" className = "loginLabel">Password</label>
                        <input type="password"  id = "loginPassword" className="loginInput" ref= {password} required minLength="6"/>
                        </div>
                        
                        
                        
                        
                        <button className="loginBtn" disabled={isFetching}>{isFetching ? <CircularProgress style = {{color: 'white'}} size="20px" /> :"Login"}</button>
                        <div className="bottom">
                            <Link to ='/register' style = {{textDecoration:'none'}}>
                        <span className="signUp">Don't have an accout? Sign Up for Dogebook</span>
                            </Link>
                        </div>
                        
                    </form>
                    
                </div>
            </div>
            
        </div>
    
    </>)
}
