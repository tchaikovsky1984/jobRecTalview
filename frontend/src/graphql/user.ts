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
