const initialState = {
  privateKey: {},
  publicKey: {},
  username: '',
  id: '',
  currentUser: {}
}

//I HATE REDUX WITH ALL MY HEART

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_USER':
      return {
        ...action.payload,
        id: action.payload.publicKey.n,
      }
    case 'SEND_ENCRYPTED_MESSAGE_CHANGE_USERNAME':
      return {
        ...state,
        username: action.payload.newUsername,
      }
    case 'LOGIN_USER':
      return {...state, currentUser: action.payload}
    default:
      return state
  }
}

export default user
