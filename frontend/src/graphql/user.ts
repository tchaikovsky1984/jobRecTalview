export const GET_USER_PROFILE_QUERY = `
  query FindUserDetails($id: Int!){
    user(where: { id : { _eq : $id } } ) {
      username
      name
      email
    }
  }
`

export const USER_LOGIN_QUERY = `
mutation UserLogin($pwd:String!, $usr: String!){
  LoginUser(password: $pwd, username: $usr){
    user_id
    access_token
    message
  }
}
`;

export const USER_REGISTER_QUERY = `
mutation UserRegister($pwd: String!, $usr: String!, $email: String!, $name: String!){
  RegisterUser(username: $usr, email: $email, password: $pwd, name: $name){
    message
    userId
  }
}
`;
