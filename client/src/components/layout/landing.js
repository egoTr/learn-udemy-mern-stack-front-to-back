import React from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
const Landing = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const LandingPage = () => {
    return (
        <Landing>
            <h1>Developer Connector</h1>
            <p>Create a developer profile, share posts and get help from the community</p>
            <div>
                <Link to="/register"><button>Sign up</button></Link>
                <Link to="/login"><button>Login</button></Link>
            </div>
        </Landing>
    )
}

export default LandingPage;