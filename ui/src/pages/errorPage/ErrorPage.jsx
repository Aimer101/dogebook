import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

import './errorPage.css'

export default function ErrorPage() {

    const history = useHistory()

    
    return (
        <div className = "errorContainer">

            <Helmet>
                <title>Page Not Found</title>
            </Helmet>
            <img src="/images/ui/icon.png" className = "errorIcon" />
            <h1 className = "codeError">404</h1>
            <h2 className = "codeError2">This is not the page you are looking for</h2>
            <p onClick = {() => history.push("/")} className = "codeError3">Click here to go home</p>
        </div>
    )
}
