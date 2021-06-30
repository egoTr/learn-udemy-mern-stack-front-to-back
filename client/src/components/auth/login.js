import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import styled, { createGlobalStyle } from 'styled-components';
const Error = styled.p`
    color: red;
    font-size: 80%;
`;

const GlobalStyle = createGlobalStyle`
    #form-login {
        display: flex;
        flex-direction: column;

        & * {
            width: 100%;
            margin-top: 5px;
        }
    }
`;

const Login = () => {
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = data;

    const [validationError, setValidationError] = useState('');

    const handleChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    } // handleChange

    const handleSubmit = (event) => {
        event.preventDefault();

        login();        
    } // handleSubmit

    const login = async () => {
        const user = { email, password };
        const body = JSON.stringify(user);

        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/auth', body, options);
        } catch(err) {
            const errorsArr = err.response.data.errors;
            const errors = errorsArr.map(error => error.msg).join('\n');

            setValidationError(errors);
        } // catch
    } // login

    return (
        <>
            <GlobalStyle />

            <h1 className="primary">Login to DevConnector</h1>

            <form id="form-login" onSubmit={handleSubmit}>
                <input type="text"
                    name="email"
                    value={email}
                    onChange={handleChange}

                    placeholder="Email"
                    required
                    autoFocus
                />

                <input type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}

                    placeholder="Password"
                    required
                />
                {validationError !== '' && <Error>{validationError}</Error>}

                <button className="btn-primary">Login</button>
            </form>
            <p>Do not have an account? <Link to="/register/">Sign up</Link></p>
        </>
    )
}

export default Login;