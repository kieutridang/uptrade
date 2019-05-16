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
  password
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

const QUERY_USER = gql`
  query{
    userProfile{
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

export { QUERY_USER, MUTATION_UPDATE_USER }
