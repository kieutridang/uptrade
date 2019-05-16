import gql from 'graphql-tag'

const responseUser = `
  _id
  companyUptradeID
  avatar
  accountType
  email
  position
  remark
  firstName
  lastName
  phoneNumber
  weChatId
  weChatNotificationActive
  whatAppId
  whatAppNotificationActive
  lineChatId
  lineChatNotificationActive
  telegramId
  telegramNotificationActive
  department
  manager
`

const responseUsersFullName = `
  _id
  companyUptradeID
  firstName
  lastName
`

const QUERY_USERS = gql`
  query UserByCompany($page: Int, $limit: Int, $filter: String) {
    userByCompany(page: $page, limit: $limit, filter: $filter) {
      totalUsers
      nextPageCursor
      hasNextPage
      users {
        ${responseUser}
      }
    }
  }
`

const QUERY_USERS_FULLNAME = gql`
  query UserByCompany($page: Int, $limit: Int, $filter: String) {
    userByCompany(page: $page, limit: $limit, filter: $filter) {
      totalUsers
      nextPageCursor
      hasNextPage
      users {
        ${responseUsersFullName}
      }
    }
  }
`

const QUERY_USER = gql`
  query($id: String!){
    user(id: $id) {
      ${responseUser}
    }
  }
`

const MUTATION_CREATE_USER = gql`
  mutation (
    $user: UserInput
  ) {
    createUser(
      user: $user
    ) {
      ${responseUser}
    }
  }
`

const MUTATION_UPDATE_USER = gql`
  mutation (
    $id: String
    $user: UserInput
  ) {
    updateUser(
      id: $id
      user: $user
    ) {
      ${responseUser}
    }
  }
`

export { QUERY_USERS, QUERY_USER, MUTATION_UPDATE_USER, MUTATION_CREATE_USER, QUERY_USERS_FULLNAME }
