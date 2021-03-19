const initialState = {
	inbox: [],
	spam: [],
	delete: [],
	custom: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ALLMAILS':
            const inboxData = action.result[0].data;
            const spamData = action.result[1].data;
            const deleteData = action.result[2].data;
            const customData = action.result[3].data;

            return {
                ...state,
                inbox: [...state.inbox, ...inboxData],
                spam: [...state.spam, ...spamData],
                delete: [...state.delete, ...deleteData],
                custom: [...state.custom, ...customData]
            };
        case 'DELETE_MAIL':
            const findIndexData = state[action.reqBody.catalog].findIndex((value) => value.mId === action.reqBody.mailId);
            let addToData = {};
            let removeFromCatalog = [...state[action.reqBody.catalog]];
            if (findIndexData > -1) {
                addToData = {...state[action.reqBody.catalog][findIndexData]};
                removeFromCatalog.splice(findIndexData, 1);
            }

            return {
                ...state,
                [action.reqBody.catalog]: [...removeFromCatalog],
                delete: [...state.delete, addToData]
            };
        case 'READED':
            const findUnreadedData = state[action.reqBody.catalog].findIndex((value) => value.mId === action.reqBody.mailId);
            let setReadedCatalog = [...state[action.reqBody.catalog]];
            if (findUnreadedData > -1) {
                setReadedCatalog[findUnreadedData].unread = false;
            }

            return {
                ...state,
                [action.reqBody.catalog]: [...setReadedCatalog]
            };
        case 'SET_FLAG':
            const findFlagData = state[action.reqBody.catalog].findIndex((value) => value.mId === action.reqBody.mailId);
            let setFlagData = [...state[action.reqBody.catalog]];
            if (findFlagData > -1) {
                setFlagData[findFlagData].flagged = !setFlagData[findFlagData].flagged;
            }

            return {
                ...state,
                [action.reqBody.catalog]: [...setFlagData]
            };
        default:
            return state;
    }
}