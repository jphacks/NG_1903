import React, { useState } from 'react';

const Index : React.FC = () => {
    const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false)
    const [isTeamLoaded, setIsTeadLoaded] = useState<boolean>(false)

    return (
        <div>
            <header>
                <p>Ichikawa</p>
                <p>Setting</p>
            </header>
            {isUserLoaded ? <div>User Loading</div> : <div>User Loaded</div>}
            {isTeamLoaded ? <div>Team Loading</div> : <div>Team Loaded</div>}
        </div>
    )
}

export default Index;