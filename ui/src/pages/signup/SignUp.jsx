import "./signup.css"
import { useRef, useState } from "react"
import axios from 'axios'
import { useHistory, } from 'react-router'
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"

export default function SignUp() {

    const username = useRef()
    const email = useRef()
    const password = useRef()
    const rePassword = useRef()
    const firstName = useRef()

    const birthday = useRef()
    const city = useRef()
    const history = useHistory()
    const [exist, setExist] = useState(null)

    const handleClick = async(e) => {
        e.preventDefault()
        if(password.current.value !== rePassword.current.value){
            return setExist('Password and Comfirm Password Did Not Match')
        }else{
            const user = {
                fullname : firstName.current.value,
                username: username.current.value,
                email: email.current.value,
                city: city.current.value,
                birthday: birthday.current.value,
                password: password.current.value,
            }
            try{

                await axios.post('auth/register', user)

                history.push('/login')
            }catch(err){
                return setExist('User with similar email / username already existed, try something else')

            }

        }
    }
    return (<>
                <Helmet>
                  <title>Sign Up for Dogebook/Dogebook</title>
                </Helmet>
            <div className={exist ? "error errorMsg" : 'error'} onClick = {() => setExist(null)}>
                <div></div>
                <p >{exist}</p>
                <div></div>
            </div>
        <div className = "signup">
            <div className="loginWrapper">
                
                <div className="loginLeft">
                <h3 className="loginLogo">Dogebook</h3>
                <span className="loginDesc">Bark and connect with people all over the world on Dogebook</span>                
                </div>

                <div className="signUpRight"> 

                    <form className="loginBox2"  onSubmit={handleClick}>

                        <div className = "signUpItem">
                    <label htmlFor = "name" className = "signUpLabel">Name</label>
                    <input  className="loginInput" ref= {firstName} required id = "name" type = 'text' maxLength = '50'/> 
                        </div>

                        <div className = "signUpItem">
                    <label htmlFor = "username" className = "signUpLabel">Username</label>
                    <input  className="loginInput" ref= {username} required id = "username" type = 'text'/> 
                        </div>

                        <div className = "signUpItem">
                    <label htmlFor = "email" className = "signUpLabel">Email</label>
                    <input  className="loginInput" ref= {email} required id = "email" type = 'email'/> 
                        </div>

                        <div className = "signUpItem">
                    <label htmlFor = "date" className = "signUpLabel">Date of Birth</label>
                    <input  className="loginInput" ref= {birthday} required id = "date" type = "date"/> 
                        </div>

                        <div className = "signUpItem">
                    <label htmlFor = "city" className = "signUpLabel">Location</label>
                    <input  className="loginInput" ref= {city} required id = "city" type = "text"/> 
                        </div>

                        <div className = "signUpItem">
                    <label htmlFor = "password" className = "signUpLabel">Password</label>
                    <input  className="loginInput" ref= {password} required id = "password" type = "password"/> 
                        </div>

                        <div className = "signUpItem">
                    <label htmlFor = "repassword" className = "signUpLabel">Comfirm Password</label>
                    <input  className="loginInput" ref = {rePassword} required id = "repassword" type = "password"/> 
                        </div>
                        <button className="loginBtn" type= "submit">Sign Up</button>
                        <div className="bottom">
                        <Link to={'/login'} style = {{textDecoration:"none"}}>
                        <span className="loginForgot meow" >Already Have an Account? Log In Here</span>
                        </Link>

                        </div>
                        
                    </form>
                    
                </div>
            </div>
            
        </div>
    </>)
}
