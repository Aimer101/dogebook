import './messanger.css'

export default function ResultSearch(props) {
    

    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    console.log(props.findUser);

    return (
                <div className= "conversation" onClick = {props.startConversation}>
            <div style = {{display: 'flex', alignItems:'center'}}>

            <img src={props?.findUser.profilePicture  ? props.findUser.profilePicture :  PF + "images/defaultPicture.jpg"} alt="" className="conversationImg" />
            <div className = "middlePa">
            <span className="conversationName">{props?.findUser.username}</span>
            </div>
            </div>
            

            
       
            </div>
    )
}
