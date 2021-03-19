import axios from 'axios';

export const utilAction = () => dispatch => {
    const getInbox = axios.get('./jsondata/inbox.json');
    const getSpam = axios.get('./jsondata/spam.json');
    const getDelete = axios.get('./jsondata/delete.json');
    const getCustom = axios.get('./jsondata/custom.json');
    
    return axios.all([getInbox, getSpam, getDelete, getCustom])
                .then(axios.spread((...responses) => {
                    dispatch({
                        type: 'GET_ALLMAILS',
                        result: [...responses]
                    })
                }))
                .catch(errors => console.log(errors));
}

export const deleteAction = (data) => dispatch => {
    dispatch({
        type: 'DELETE_MAIL',
        reqBody: data
    });
}

export const readedAction = (data) => dispatch => {
    dispatch({
        type: 'READED',
        reqBody: data
    })
}

export const setFlagAction = (data) => dispatch => {
    dispatch({
        type: 'SET_FLAG',
        reqBody: data
    })
}