export const GET_USER_PROFILE_QUERY = `
  query FindUserDetails($id: Int!){
    user(where: { id : { _eq : $id } } ) {
      username
      name
      email
    }
  }
`
