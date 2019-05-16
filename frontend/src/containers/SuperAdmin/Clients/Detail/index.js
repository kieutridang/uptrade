import React from 'react'
import Typography from '@material-ui/core/Typography'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'

import Company from '../components/Company'
import Admin from '../components/Admin'
import UsersList from '../components/UsersList'
import CreateUserProfile from '../components/CreateUserProfile'
import UserProfile from '../components/UserProfile'
import { ComponentLoading } from '../../../../components/Loading'
import SnackBar from '../../../../components/Snackbar/index'

import '../index.scss'
import { QUERY_COMPANY, QUERY_USER, MUTATION_UPDATE_COMPANY, MUTATION_CREATE_USER, MUTATION_UPDATE_USER } from '../client.typedef'
import { companyValidationSchema, userProfileValidationSchema } from '../client.validation'
import { initialOriginUserProfile } from '../client.initialOriginalValues'

class ClientsDetail extends React.Component {
  openEditProfileForm = async (userId, type) => {
    const { getUser, showUserThatNeedToEdit } = this.props
    try {
      const response = await getUser.refetch({
        id: userId
      })
      if (response && response.data && response.data.user) {
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
    const { viewCompanyMode, showUserProfileForm, initialUserValues, viewProfileMode, getCompany, typeOfUserProfile,
      submitUpdateCompanyHandler, submitUpdateUserHandler, submitCreateUserHandler, handleToggleActiveEdit, alertMessage } = this.props
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
    if (getCompany.loading) {
      return <ComponentLoading />
    } else {
      const alertComponent = alertMessage.message && <SnackBar message={alertMessage.message} variant={alertMessage.variant} />
      const companyDetail = getCompany.company
      const admins = companyDetail._admins
      const users = companyDetail._users
      return (
        <Typography component='div' style={{ padding: 24 }}>
          <article className='article products closebox'>
            <div className='row article-notitle'>
              <div className='col-sm-12'>
                {companyDetail &&
                  <Company
                    viewMode={viewCompanyMode}
                    validationSchema={companyValidationSchema}
                    initialValues={companyDetail.about}
                    submitHandler={submitUpdateCompanyHandler}
                    handleToggleActiveEdit={handleToggleActiveEdit}
                  />
                }
                {admins && <Admin
                  openNewProfileFormHandler={this.openNewProfileForm}
                  openEditProfileFormHandler={this.openEditProfileForm}
                  adminList={admins}
                  // deleteUserHandler={submitDeleteUser}
                />
                }
                {users && <UsersList
                  userList={users}
                  openNewProfileFormHandler={this.openNewProfileForm}
                  openEditProfileFormHandler={this.openEditProfileForm}
                  // deleteUserHandler={submitDeleteUser}
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
  graphql(QUERY_COMPANY, {
    name: 'getCompany',
    options: props => {
      return {
        variables: {
          id: props.match.params.id
        }
      }
    }
  }),
  graphql(MUTATION_UPDATE_COMPANY, {
    name: 'updateCompany'
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
  withStateHandlers(
    ({
      userId = null,
      viewCompanyMode = 'show',
      viewProfileMode = 'new',
      showUserProfileForm = false,
      typeOfUserProfile = null,
      initialUserValues = initialOriginUserProfile,
      alertMessage = {
        message: '',
        variant: ''
      }
    }) => ({
      userId,
      viewCompanyMode,
      viewProfileMode,
      showUserProfileForm,
      initialUserValues,
      typeOfUserProfile,
      alertMessage
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
          case 'activeCompanyEdit': {
            return { viewCompanyMode: 'edit' }
          }
          case 'activeCompanyShow': {
            return { viewCompanyMode: 'show' }
          }
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
      submitUpdateCompanyHandler: (_, props) => async (values, { setSubmitting, setErrors }) => {
        const { updateCompany, match, handleShowMessage, handleToggleActiveEdit, getCompany } = props
        const { refetch } = getCompany
        setSubmitting(true)
        try {
          delete values.__typename
          const response = await updateCompany({
            variables: {
              id: match.params.id,
              company: {
                about: values
              }
            }
          })
          if (response && response.data && response.data.updateCompany) {
            refetch()
            handleShowMessage('Update company successfully', 'success')
            handleToggleActiveEdit('activeCompanyShow')
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        }
        setSubmitting(false)
      },
      submitCreateUserHandler: (_, { createUser, getCompany, match, handleToggleActiveEdit, handleShowMessage }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          values.companyUptradeID = getCompany.company.about.uptradeID
          values.status = 'ACTIVE'
          const response = await createUser({
            variables: {
              user: values
            },
            refetchQueries: [{
              query: QUERY_COMPANY,
              variables: {
                id: match.params.id
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
      submitDeleteUser: ({ userId }, { updateUser, handleShowMessage, match, updateCompany, getCompany }) => async (values) => {
        try {
          const currentUserId = userId || values._id
          delete values.__typename
          delete values._id
          values.status = 'INACTIVE'
          const response = await updateUser({
            variables: {
              id: currentUserId,
              user: values
            },
            refetchQueries: [{
              query: QUERY_COMPANY,
              variables: {
                id: match.params.id
              }
            }]
          })
          if (response && response.data && response.data.updateUser) {
            let usersArray = (await getCompany).company.users
            usersArray = usersArray.filter(user => user !== currentUserId)

            const deleteUser = await updateCompany({
              variables: {
                id: match.params.id,
                company: {
                  users: usersArray
                }
              },
              refetchQueries: [{
                query: QUERY_COMPANY,
                variables: {
                  id: match.params.id
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
      },
      submitUpdateUserHandler: ({ userId }, { updateUser, getCompany, handleToggleActiveEdit, match, handleShowMessage }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          const currentUserId = userId || values._id
          delete values.__typename
          delete values._id
          values.companyUptradeID = getCompany.company.about.uptradeID

          const response = await updateUser({
            variables: {
              id: currentUserId,
              user: values
            },
            refetchQueries: [{
              query: QUERY_COMPANY,
              variables: {
                id: match.params.id
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
      }
    }
  )
)(ClientsDetail)
