import React from 'react'
import Typography from '@material-ui/core/Typography'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'

import UsersList from './components/UsersList'
import CreateUserProfile from './components/CreateUserProfile'
import UserProfile from './components/UserProfile'
import { ComponentLoading } from '../../../../components/Loading'
import SnackBar from '../../../../components/Snackbar'

import '../index.scss'
import {
  QUERY_USERS,
  QUERY_USER,
  MUTATION_CREATE_USER,
  MUTATION_UPDATE_USER,
  MUTATION_SEND_PASSWORD_EMAIL,
  QUERY_COMPANY,
  MUTATION_UPDATE_COMPANY
} from '../../settings.typedef'
import { userProfileValidationSchema } from '../../settings.validation'
import { initialOriginUserProfile } from '../../settings.initialOriginalValues'

class ClientsDetail extends React.Component {
  openEditProfileForm = async (userId) => {
    const { getUser, showUserThatNeedToEdit } = this.props
    try {
      const response = await getUser.refetch({
        id: userId
      })
      if (response && response.data && response.data.user) {
        const { accountType } = response.data.user
        let type
        if (accountType === 'ADMIN') {
          type = 'admin'
        } else {
          type = 'user'
        }
        showUserThatNeedToEdit(response.data.user, type)
        setTimeout(() => {
          const form = document.getElementById('form-user')
          form.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' })
        }, 0)
      }
    } catch (error) {
      console.log(error)
    }
  }
  openNewProfileForm = async (type) => {
    await this.props.openNewProfileForm(type)
    setTimeout(() => {
      const form = document.getElementById('form-user')
      form.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' })
    }, 0)
  }

  render () {
    const { showUserProfileForm, initialUserValues, viewProfileMode, getUsers, typeOfUserProfile,
      submitUpdateUserHandler, submitCreateUserHandler, handleToggleActiveEdit, alertMessage,
      sendPasswordLinkHandler } = this.props
    let profileComponent
    if (showUserProfileForm) {
      switch (viewProfileMode) {
        case 'new': {
          profileComponent = <CreateUserProfile
            viewMode={viewProfileMode}
            validationSchema={userProfileValidationSchema}
            initialValues={initialUserValues}
            submitHandler={submitCreateUserHandler}
            handleToggleActiveEdit={handleToggleActiveEdit}
            typeOfUserProfile={typeOfUserProfile}
          />
          break
        }
        case 'show': {
          profileComponent = <UserProfile
            viewMode={viewProfileMode}
            validationSchema={userProfileValidationSchema}
            initialValues={initialUserValues}
            submitHandler={submitUpdateUserHandler}
            handleToggleActiveEdit={handleToggleActiveEdit}
            typeOfUserProfile={typeOfUserProfile}
          />
          break
        }
        case 'edit': {
          profileComponent = <UserProfile
            viewMode={viewProfileMode}
            validationSchema={userProfileValidationSchema}
            initialValues={initialUserValues}
            submitHandler={submitUpdateUserHandler}
            handleToggleActiveEdit={handleToggleActiveEdit}
            typeOfUserProfile={typeOfUserProfile}
          />
          break
        }
        default: return null
      }
    }
    if (getUsers.loading) {
      return <ComponentLoading />
    } else {
      const alertComponent = alertMessage.message && <SnackBar message={alertMessage.message} variant={alertMessage.variant} />
      const users = getUsers.userByCompany.users
      return (
        <Typography component='div'>
          <article className='article products closebox'>
            <div className='row article-notitle'>
              <div className='col-sm-12'>
                {users && <UsersList
                  userList={users}
                  openNewProfileFormHandler={this.openNewProfileForm}
                  openEditProfileFormHandler={this.openEditProfileForm}
                  sendResetPasswordHandler={sendPasswordLinkHandler}
                  // deleteUserInCompanyHandler={deleteUserHandler}
                />
                }
                {profileComponent}
                {alertComponent}
              </div>
            </div>
          </article>
        </Typography>
      )
    }
  }
}

export default compose(
  graphql(QUERY_USERS, {
    name: 'getUsers',
    options: props => {
      return {
        variables: {
          page: 1,
          limit: 1000 // TODO: pagination and change it
        }
      }
    }
  }),
  graphql(QUERY_USER, {
    name: 'getUser',
    options: props => {
      return {
        variables: {
          id: '1'
        }
      }
    }
  }),
  graphql(MUTATION_CREATE_USER, {
    name: 'createUser'
  }),
  graphql(MUTATION_UPDATE_USER, {
    name: 'updateUser'
  }),
  graphql(MUTATION_SEND_PASSWORD_EMAIL, {
    name: 'resetPasswordEmail'
  }),
  graphql(QUERY_COMPANY, {
    name: 'getCompany',
    options: props => {
      return {
        variables: {
          companyUptradeID: window.localStorage.getItem('companyUptradeID')
        }
      }
    }
  }),
  graphql(MUTATION_UPDATE_COMPANY, {
    name: 'updateCompany'
  }),
  withStateHandlers(
    ({
      userId = null,
      viewProfileMode = 'new',
      showUserProfileForm = false,
      typeOfUserProfile = null,
      initialUserValues = initialOriginUserProfile,
      alertMessage = {
        message: '',
        variant: ''
      },
      userEmail = null
    }) => ({
      userId,
      viewProfileMode,
      showUserProfileForm,
      initialUserValues,
      typeOfUserProfile,
      alertMessage,
      userEmail
    }), {
      showUserThatNeedToEdit: () => (user, type) => {
        return {
          typeOfUserProfile: type,
          showUserProfileForm: true,
          initialUserValues: { ...user, password: '' },
          viewProfileMode: 'show',
          userId: user._id
        }
      },
      openNewProfileForm: (_, { match }) => (type) => {
        return {
          showUserProfileForm: true,
          initialUserValues: initialOriginUserProfile,
          typeOfUserProfile: type,
          viewProfileMode: 'new',
          companyUptradeID: match.params.id
        }
      },
      handleToggleActiveEdit: () => (name) => {
        switch (name) {
          case 'activeProfileEdit': {
            return { viewProfileMode: 'edit' }
          }
          case 'activeProfileShow': {
            return { viewProfileMode: 'show' }
          }
          case 'closeNewProfileForm': {
            return { showUserProfileForm: false }
          }
          default: return {}
        }
      },
      handleShowMessage: () => (message, type) => {
        return {
          alertMessage: { message: message, variant: type }
        }
      }
    }),
  withStateHandlers(
    (_) => ({}), {
      submitCreateUserHandler: (_, { createUser, handleToggleActiveEdit, handleShowMessage }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          values.companyUptradeID = window.localStorage.getItem('companyUptradeID')
          values.status = 'ACTIVE'
          const response = await createUser({
            variables: {
              user: values
            },
            refetchQueries: [{
              query: QUERY_USERS,
              variables: {
                page: 1,
                limit: 1000
              }
            }]
          })
          if (response && response.data && response.data.createUser) {
            handleShowMessage('New user has been created successfully', 'success')
            handleToggleActiveEdit('closeNewProfileForm')
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        }
        setSubmitting(false)
      },
      submitUpdateUserHandler: ({ userId }, { updateUser, handleToggleActiveEdit, handleShowMessage }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          const currentUserId = userId || values._id
          delete values.__typename
          delete values._id
          values.companyUptradeID = window.localStorage.getItem('companyUptradeID')

          const response = await updateUser({
            variables: {
              id: currentUserId,
              user: values
            },
            refetchQueries: [{
              query: QUERY_USERS,
              variables: {
                page: 1,
                limit: 1000
              }
            }]
          })
          if (response && response.data && response.data.updateUser) {
            handleShowMessage('Update user successfully', 'success')
            handleToggleActiveEdit('activeProfileShow')
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
          console.error(msg, exception)
        }
        setSubmitting(false)
      },
      sendPasswordLinkHandler: (_, { resetPasswordEmail, handleShowMessage }) => async (values) => {
        try {
          const response = await resetPasswordEmail({
            variables: {
              email: values
            }
          })
          if (response && response.data && response.data.resetPassword && response.data.resetPassword.success === true) {
            handleShowMessage('Send forget password email successful', 'success')
          }
        } catch (error) {
          console.error(error)
        }
      },
      deleteUserHandler: ({ userId }, { getCompany, updateCompany, updateUser, handleShowMessage }) => async (values) => {
        try {
          const currentUserId = userId || values._id
          delete values.__typename
          delete values._id
          values.companyUptradeID = window.localStorage.getItem('companyUptradeID')
          values.status = 'INACTIVE'

          const response = await updateUser({
            variables: {
              id: currentUserId,
              user: values
            },
            refetchQueries: [{
              query: QUERY_USERS,
              variables: {
                page: 1,
                limit: 1000
              }
            }]
          })

          if (response && response.data && response.data.updateUser) {
            let userCompany = window.localStorage.getItem('companyUptradeID')
            let usersArray = (await getCompany).company.users
            usersArray = usersArray.filter(user => user !== currentUserId)

            const deleteUser = await updateCompany({
              variables: {
                companyUptradeID: userCompany,
                company: {
                  users: usersArray
                }
              },
              refetchQueries: [{
                query: QUERY_COMPANY,
                variables: {
                  companyUptradeID: userCompany
                }
              }]
            })

            if (deleteUser && deleteUser.data && deleteUser.data.updateCompany) {
              handleShowMessage('Delete user successfully', 'success')
            }
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          console.error(msg, exception)
        }
      }
    }
  )
)(ClientsDetail)
