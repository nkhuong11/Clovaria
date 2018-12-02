import { GET_ALL_DATA } from '../actions/types';

const initialState = {
    all_users: []
};

export default function(state = initialState, action ) {
    switch(action.type) {
        case GET_ALL_DATA:
            return {
                ...state,
                all_users: action.payload.all_users
            }
        default: 
            return state;
    }
}