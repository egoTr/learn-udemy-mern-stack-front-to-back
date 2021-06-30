import React from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
const Nav = styled.div`
    display: flex;
    justify-content: space-around;
`;

const NavBar = () => {
    return (
        <Nav>
            <Link to="/">DevConnector</Link>
            <Link to="/profiles">Developers</Link>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
        </Nav>
    )
}

export default NavBar;