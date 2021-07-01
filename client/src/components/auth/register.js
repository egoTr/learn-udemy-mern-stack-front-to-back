import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';

import styled, { createGlobalStyle } from 'styled-components';
const Error = styled.p`
    color: red;
    font-size: 80%;
`;

const GlobalStyle = createGlobalStyle`
    #form-register {
        display: flex;
        flex-direction: column;

        & * {
            width: 100%;
            margin-top: 5px;
        }
    }
`;

const Register = (props) => {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });
    const { name, email, password, passwordConfirm } = data;

    const [validationError, setValidationError] = useState('');

    const handleChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    } // handleChange

    const handleSubmit = (event) => {
        event.preventDefault();

        // Check if passwords match
        if (passwordConfirm !== password) {
            props.setAlert('Passwords do not match', 'danger')
            return setValidationError('Passwords do not match');
        } // if
        
        // Reset validation for passwords
        setValidationError('');

        register({ name, email, password });        
    } // handleSubmit

    /* const register = async () => {
        const user = { name, email, password };
        const body = JSON.stringify(user);

        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/users', body, options);
        } catch(err) {
            const errorsArr = err.response.data.errors;
            const errors = errorsArr.map(error => error.msg).join('\n');

            setValidationError(errors);
        } // catch
    } // register */

    return (
        <>
            <GlobalStyle />

            <h1 className="primary">Register</h1>

            <form id="form-register" onSubmit={handleSubmit}>
                <input type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}

                    placeholder="Name"
                    required
                    autoFocus
                />

                <input type="text"
                    name="email"
                    value={email}
                    onChange={handleChange}

                    placeholder="Email"
                    required
                />

                <input type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}

                    placeholder="Password"
                    required
                />

                <input type="password"
                    name="passwordConfirm"
                    value={passwordConfirm}
                    onChange={handleChange}

                    placeholder="Confirm password"
                    required
                />
                {validationError !== '' && <Error>{validationError}</Error>}

                <button className="btn-primary">Submit</button>
            </form>
            <p>Already have an account? <Link to="/login/">Login</Link></p>
        </>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired
}

export default connect(
    null,
    { setAlert, register }
)(Register);