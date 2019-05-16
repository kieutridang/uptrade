import React from 'react'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'

import NotificationForm from './components/NotificationForm'
import { QUERY_COMPANY, MUTATION_UPDATE_COMPANY } from '../../settings.typedef'
import { ComponentLoading } from '../../../../components/Loading'
import FormModel from '../../../../components/FormModel'
class Notifications extends React.Component {
  render () {
    const { getCompany, submitUpdateNotificationsHandler, handleToggleActiveEdit, viewNotificationMode } = this.props

    if (getCompany.loading) {
      return <ComponentLoading />
    } else {
      const companyDetail = getCompany.company

      return (
        <article className='article products closebox'>
          <div className='row article-notitle'>
            <div className='col-sm-12'>
              <FormModel
                initialValues={companyDetail}
                submitHandler={submitUpdateNotificationsHandler}
                component={<NotificationForm
                  viewMode={viewNotificationMode}
                  handleToggleActiveEdit={handleToggleActiveEdit}
                  {...this.props}
                />}
              />
            </div>
          </div>
        </article>
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
      viewNotificationMode = 'show'
    }) => ({
      viewNotificationMode
    }), {
      handleToggleActiveEdit: () => (name) => {
        switch (name) {
          case 'activeNotificationEdit': {
            return { viewNotificationMode: 'edit' }
          }
          case 'activeNotificationShow': {
            return { viewNotificationMode: 'show' }
          }
          default: return {}
        }
      }
    }
  ),
  withStateHandlers(
    (_) => ({}), {
      submitUpdateNotificationsHandler: (_, props) => async (values, { setSubmitting, setErrors }) => {
        const { updateCompany, handleToggleActiveEdit } = props
        setSubmitting(true)
        try {
          const notifications = values.notifications
          delete notifications.__typename
          const response = await updateCompany({
            variables: {
              id: values._id,
              company: {
                notifications
              }
            },
            refetchQueries: [{
              query: QUERY_COMPANY,
              variables: {
                companyUptradeID: window.localStorage.getItem('companyUptradeID')
              }
            }]
          })
          if (response && response.data && response.data.updateCompany) {
            handleToggleActiveEdit('activeNotificationShow')
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        }
        setSubmitting(false)
      }
    }
  )
)(Notifications)
