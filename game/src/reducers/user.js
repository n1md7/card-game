const user = (state = {
    id: '',
    name: ''
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