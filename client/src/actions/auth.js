import axios from "axios";
import { setAlert } from './alert';
import { REGISTER_SUCCESS, REGISTER_FAIL } from './types';

// Register user
export const register = ({ name, email, password }) => async dispatch => {
    const options = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('/api/users', body, options)

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        }) // dispatch
    } catch (err) {
        const errors = err.reponse.data.errors;
        if (errors)
            errors.forEach(error =>
                dispatch( setAlert(error.msg, 'danger') )
            ) // forEach
        dispatch({
            type: REGISTER_FAIL
        })
    } // catch
} // register