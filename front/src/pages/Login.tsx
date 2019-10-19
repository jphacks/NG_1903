import React from 'react';
import  { GoogleLogin, GoogleLogout } from 'react-google-login'

const responseGoogle = (response:any) => {
    console.log(response);
    
}

const Login: React.FC = () => {
    console.log("login")
    return (
        <div>
            <GoogleLogin
                clientId="433618952640-37ar21n8s7m5fhn728f23vjap40kou9s.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}

export default Login