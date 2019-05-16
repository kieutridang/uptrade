import React from 'react'
import QueueAnim from 'rc-queue-anim'
import Typography from '@material-ui/core/Typography'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'

import UserProfile from './components/UserProfile'
import { ComponentLoading } from '../../components/Loading'
import SnackBar from '../../components/Snackbar'

import './index.scss'
import { QUERY_USER, MUTATION_UPDATE_USER } from './profile.typedef'
import { userProfileValidationSchema } from './profile.validation'

class ClientsDetail extends React.Component {
  render () {
    const { viewProfileMode, getUser,
      submitUpdateUserHandler, handleToggleActiveEdit, alertMessage } = this.props
    if (getUser.loading) {
      return <ComponentLoading />
    } else {
      const userDetail = getUser.userProfile
      const { accountType } = userDetail
      let typeOfUserProfile
      if (accountType === 'ADMIN') {
        typeOfUserProfile = 'admin'
      } else {
        typeOfUserProfile = 'user'
      }
      const alertComponent = alertMessage.message && <SnackBar message={alertMessage.message} variant={alertMessage.variant} />
      return (
        <div style={{ backgroundColor: '#f5f5f5' }}>
          <QueueAnim type='bottom' className='ui-animate'>
            <Typography component='div' style={{ padding: 24 }}>
              <article className='article products closebox'>
                <div className='row article-notitle'>
                  <div className='col-sm-12'>
                    <UserProfile
                      viewMode={viewProfileMode}
                      validationSchema={userProfileValidationSchema}
                      initialValues={userDetail}
                      submitHandler={submitUpdateUserHandler}
                      handleToggleActiveEdit={handleToggleActiveEdit}
                      typeOfUserProfile={typeOfUserProfile}
                    />
                    {alertComponent}
                  </div>
                </div>
              </article>
            </Typography>
          </QueueAnim>
        </div>
      )
    }
  }
}

export default compose(
  graphql(QUERY_USER, {
    name: 'getUser'
  }),
  graphql(MUTATION_UPDATE_USER, {
    name: 'updateUser'
  }),
  withStateHandlers(
    ({
      userId = null,
      viewProfileMode = 'show',
      alertMessage = {
        message: '',
        variant: ''
      }
    }) => ({
      userId,
      viewProfileMode,
      alertMessage
    }), {
      handleToggleActiveEdit: () => (name) => {
        switch (name) {
          case 'activeProfileEdit': {
            return { viewProfileMode: 'edit' }
          }
          case 'activeProfileShow': {
            return { viewProfileMode: 'show' }
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
      submitUpdateUserHandler: ({ userId }, { updateUser, handleToggleActiveEdit, handleShowMessage }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          const currentUserId = values._id
          delete values.__typename
          delete values._id
          values.companyUptradeID = window.localStorage.getItem('companyUptradeID')

          const response = await updateUser({
            variables: {
              id: currentUserId,
              user: values
            },
            refetchQueries: [{
              query: QUERY_USER
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
