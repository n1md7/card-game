const user = (state = {
    id: null,
    name: null,
    roomId: null
}, {type, ...rest}) => {
    switch (type) {
        case 'UPDATE':
            return {
                ...state,
                ...rest
            };
        default:
            return state
    }
}

export default user;