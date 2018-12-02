import axios from 'axios';
import { GET_ALL_DATA, GET_ERRORS } from './types';

export const getAllUsers = () => dispatch => {
    axios.get('/api/get/users')
        .then(res => {
            const {data} = res;
            dispatch(setData(data));
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}

export const setData = data => {
    return {
        type: GET_ALL_DATA,
        payload: data
    }
}