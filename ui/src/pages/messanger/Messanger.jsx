import './messanger.css'
import Conversation from '../../components/conversation/Conversation'
import Message from '../../components/message/Message'
import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import socket from '../../socketConfig'
import Leftbar from '../../components/leftbar/Leftbar'
import {SearchOutlined, Send} from "@material-ui/icons"
import TextareaAutosize from 'react-textarea-autosize';
import { Helmet } from 'react-helmet'
import { CircularProgress } from '@material-ui/core'
import ResultSearch from './ResultSearch'


export default function Messanger() {
    const {user} = useContext(AuthContext)
    const [conversation, setConversation] = useState([]) // to get the user to chat with
    const [currentChat, setCurrentChat] = useState(null) // so that when we click, it appears on middle box
    const [messages, setMessages] = useState([]) // fetch all the conversation with that user
    const[arrivalMessage, setArrivalMessage] = useState(null)
    const [newMessage , setNewMessage] = useState("")
    const scrollRef = useRef()
    const [start, setStart] = useState(false)
    const [findUser, setFindUser] = useState(null)
    const [fetchingConversation, setFetchingConversation] = useState(true)
    const [search, setSearch] = useState(null)
    
    const handleChange = (chatId) => {
        if(conversation[0]._id === chatId){
            return
        }
        else{
            var update = []
            for(let i = 0; i < conversation.length; i++){
                    if(conversation[i]._id === chatId){
                        update.unshift(conversation[i])
                        continue
                    }else{
                        update.push(conversation[i])
                    }
            }
            setConversation(update)
        }
    }

    


    const handleSearch = async(e) => {
        if(e.target.value && user.username !== e.target.value){
            try{
                const res = await axios.get(`/users?username=${e.target.value}`)
                setFindUser(res.data)
            }catch(err){
                setFindUser(false)

            }

        }else{
            setFindUser(false)
        }   
    }

    const initiate = (el) => {
        setCurrentChat(el)

        axios.put(`/message/${el._id}`, {otherPerson: user._id})

    }

    const handleSearchNew = async(e) => {
        setSearch(e.target.value)
        if(e.target.value){
            setStart(true)
        if(user.username !== e.target.value){
            try{
                const res = await axios.get(`/users?username=${e.target.value}`)
                setFindUser(res.data)
            }catch(err){
                setFindUser(null)

            }
        }
        user.username === e.target.value &&  setFindUser(null)
        }
        (!e.target.value) && setStart(false)
    }

    const startConversation = async() => {
        var makeNew = true
        conversation.map(i => {
            if(i.members.includes(findUser._id)){
                initiate(i)
                
                setStart(!start)

                return makeNew = false
            }
        })
        if(makeNew === true){

            const res = await axios.post(`/conversation`, {senderId: user._id, receiverId: findUser._id})
            setStart(!start)
            socket.emit('newChatOpen', (
                {
                    receiverId : `${findUser._id}`,
                }
                    ) 
                )
            setConversation([res.data, ...conversation])
            initiate(res.data)
        }
    }

    useEffect(() => {
        socket.on('getMessage', (data) => {

            setArrivalMessage({
                senderId: data.senderId,
                text: data.text,
                createdAt: Date.now()
            }
            
            )

        }
        
        )
    }, [])

    useEffect(() => {
        socket.on('newChatOpen', async(data) => {
            const allConversation = await axios.get(`/conversation/${user._id}`)
            var noStartTime = []
            var haveStartTime = []
            allConversation.data.map( i => {
                if(i.lastTime === null){
                    noStartTime.push(i)
                }
                if(i.lastTime !== null){
                    haveStartTime.push(i)
                }
            })
            var total = haveStartTime.sort((p1,p2) => {
                return new Date(p2.lastTime) - new Date(p1.lastTime)
            })

            total = [...total, ...noStartTime]
            setConversation(total)
        })
    }, [])

    useEffect(() => {

        arrivalMessage && currentChat?.members.includes(arrivalMessage.senderId) && setMessages((prev) => [...prev, arrivalMessage])
        
    }, [arrivalMessage, currentChat])



    useEffect(() => {
        
        scrollRef.current?.scrollIntoView({behavior:"smooth"})
    }, [messages])

    useEffect( () => {

        const getMessages = async() => {
            try{
                const res = await axios.get(`/message/${currentChat?._id}`)

                setMessages(res.data)
                
            }catch(err){
            }
            
        }
        getMessages()

        
    }, [currentChat])

    

    useEffect(() => {
        const getConversation = async() => {
            try{
                const allConversation = await axios.get(`/conversation/${user._id}`)
                var noStartTime = []
                var haveStartTime = []
                allConversation.data.map( i => {
                    if(i.lastTime === null){
                        noStartTime.push(i)
                    }
                    if(i.lastTime !== null){
                        haveStartTime.push(i)
                    }
                })
                var total = haveStartTime.sort((p1,p2) => {
                    return new Date(p2.lastTime) - new Date(p1.lastTime)
                })

                total = [...total, ...noStartTime]
                setConversation(total)
                setFetchingConversation(false)

            }catch(err){
            }
        }

        getConversation()
    },[user?._id])

    const handleSubmit = async(e) => {
        e.preventDefault()
        const receiverId = currentChat.members.find(item => item !== user._id)
        const message = {
            senderId:user._id,
            text: newMessage,
            conversationId: currentChat._id,
            receiverId
        }



        try{
            const res = await axios.post(`/message`, message)
            
            socket.emit("sendMessage",{
                senderId: user._id,
                receiverId,
                text: newMessage,
                conversationId: currentChat._id
            })
            setArrivalMessage(res.data)
            handleChange(currentChat._id)
            setNewMessage("")   
        }catch(err){
        }
    }

    return (
        <>

                <Helmet>
                  <title>Messages/Dogebook</title>
                </Helmet>



             <div className = "messangerContainer">   

        
        <div className="messanger">
            <Leftbar />

            <div className="chatOnline">
            <p className = "currentPageHome" style = {{marginBottom: '10px'}}>Messages</p>
            <div className="chatMenuWrapper">

                <form className = "messagerSearch">
                    <SearchOutlined />
                    <input type="text" placeholder = "Search For Users" className="chatMenuInput" value = {search} onChange = {handleSearchNew}/>
                </form>
                    {
                        fetchingConversation && 
                        <div style = {{ textAlign:"center", paddingTop: "100px"}}>

                        <CircularProgress />
                        </div>
                    }
                    {!start && conversation.map(el => 
                    <div onClick = {() => initiate(el)} key = {el._id}>
                        <Conversation  conversation = {el} currentChat = {currentChat?._id} handleChange = {handleChange}/>
                    </div>

)}
{
    start && !findUser && <div className = "handleSearch">
        <h1>No result for {search}</h1>
        <p>The term you entered did not bring up any results. Currently only people are searchable.</p>
    </div>
}

{
    start && findUser && <div className = "handleSearch" style = {{marginTop: '-5px'}}>
        <ResultSearch findUser = {findUser} startConversation = {startConversation}/>
    </div>
}
                </div>
            </div>

            
            <div className="chatBox">
            <div className="chatBoxWrapper">
                {currentChat ?
                        <>
                        <div className = "whatsapp">
                            <img src = {currentChat.userProfilePicture} className = "whatsappImg"/>
                            <div className = "whatsappDetail">
                            <span className="whatsappFullname">{currentChat.userFullname}</span>
                            <span className = "whatsappUsername">@{currentChat.userUsername}</span>
                            </div>

                        </div>
                    <div className="chatBoxTop">
                        {
                                messages.map(el => (
                            <div ref = {scrollRef}>
                            
                                <Message own = {user?._id === el.senderId} msg = {el}/>
                            </div>
                            ))
                        }
                        
                        
                    </div>
                    <form className="chatBoxBtm" onSubmit= {handleSubmit}>
                       <TextareaAutosize placeholder="Write something" className = "chatMessageInput" value = {newMessage} onChange = {(e) =>setNewMessage(e.target.value)} />
                       <button className = "chatSubmitBtn" type = "submit" disabled = {!newMessage? true : false}>
                           <Send />
                       </button>
                    </form>

                    </>
                        :
                        <>

                        <span className = 'noConversation'>You don’t have a message selected</span>
                        <span className = 'noConversation2'>Choose one from your existing messages, or start a new one.</span>
                        </>}

                    
                    </div>
            </div>
            
            
        </div>
        </div>
    </>)
}
