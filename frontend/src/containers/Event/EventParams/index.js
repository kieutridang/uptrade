import React from 'react'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'
import AppConfig from '../../../config/AppConfig'
import FormModel from '../../../components/FormModel'
import { ComponentLoading } from '../../../components/Loading'
import EventSettings from './components/EventSettings'
import Participants from './components/Participants'
import SnackBar from '../../../components/Snackbar'
import countryData from '../../../assets/countryData'

import {
  QUERY_EVENT,
  MUTATION_UPDATE_EVENT,
  QUERY_COMPANY_CUSTOMERS,
  QUERY_COMPANY_SUPPLIERS,
  MUTATION_SEND_EVENT_INVITATION_EMAIL,
  QUERY_COUNTRY
} from '../event.typedef'

class EventParams extends React.Component {
  componentDidMount () {
    if (window.mobilecheck()) {
      const id = this.props.match.params.id
      window.location.assign(`${AppConfig.MOBILE_URL}/app/home/event/settings/${id}`)
    }
  }

  getDefaultEventDetail = (eventDetail) => {
    const { country, city } = eventDetail
    let newValue = JSON.parse(JSON.stringify(eventDetail))
    if (country) {
      const foundCountry = countryData.find(data => (data.common === country))
      newValue = {
        ...newValue,
        country: foundCountry
      }
    }
    if (city) {
      newValue = {
        ...newValue,
        city: {
          label: city,
          value: city
        }
      }
    }
    return newValue
  }

  render () {
    const {
      getEvent,
      handleToggleActiveEdit,
      viewEventSettingsMode,
      viewParticipantsMode,
      alertMessage,
      submitUpdateEventSettingHandler,
      submitUpdateParticipantsHandler,
      handleSendEventInvationEmail,
      getCompanyCustomers,
      getCompanySuppliers,
      getCityList
    } = this.props
    if (getEvent.loading || getCompanyCustomers.loading || getCompanySuppliers.loading) {
      return <ComponentLoading />
    } else {
      const eventDetail = getEvent.event
      const alertComponent = alertMessage.message && <SnackBar message={alertMessage.message} variant={alertMessage.variant} />
      return (
        eventDetail &&
        <article className='article products closebox'>
          <div style={{ padding: 24, backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 104px)' }}>
            <div className='row'>
              <div className='col-sm-12'>
                <FormModel
                  initialValues={this.getDefaultEventDetail(eventDetail)}
                  submitHandler={submitUpdateEventSettingHandler}
                  component={<EventSettings
                    viewMode={viewEventSettingsMode}
                    handleToggleActiveEdit={handleToggleActiveEdit}
                    getCityList={getCityList}
                    {...this.props}
                  />}
                />
                <FormModel
                  initialValues={eventDetail}
                  submitHandler={submitUpdateParticipantsHandler}
                  component={<Participants
                    viewMode={viewParticipantsMode}
                    handleToggleActiveEdit={handleToggleActiveEdit}
                    getCompanyCustomers={getCompanyCustomers}
                    getCompanySuppliers={getCompanySuppliers}
                    handleSendEventInvationEmail={handleSendEventInvationEmail}
                    {...this.props}
                  />}
                />
              </div>
            </div>
          </div>
          {alertComponent}
        </article>
      )
    }
  }
}

export default compose(
  graphql(QUERY_EVENT, {
    name: 'getEvent',
    options: props => {
      return {
        variables: {
          id: props.match.params.id
        }
      }
    }
  }),
  graphql(QUERY_COMPANY_CUSTOMERS, {
    name: 'getCompanyCustomers',
    options: () => {
      return {
        variables: {
          page: -1,
          limit: -1
        }
      }
    }
  }),
  graphql(QUERY_COMPANY_SUPPLIERS, {
    name: 'getCompanySuppliers',
    options: () => {
      return {
        variables: {
          page: -1,
          limit: -1
        }
      }
    }
  }),
  graphql(MUTATION_UPDATE_EVENT, {
    name: 'updateEvent'
  }),
  graphql(MUTATION_SEND_EVENT_INVITATION_EMAIL, {
    name: 'sendEventInvitationEmail'
  }),
  graphql(QUERY_COUNTRY, {
    name: 'getCityList'
  }),
  withStateHandlers(
    ({
      viewEventSettingsMode = 'show',
      viewParticipantsMode = 'show',
      alertMessage = {
        message: '',
        variant: ''
      }

    }) => ({
      viewEventSettingsMode,
      viewParticipantsMode,
      alertMessage
    }), {
      handleToggleActiveEdit: () => (name) => {
        switch (name) {
          case 'activeEventSettingsEdit': {
            return { viewEventSettingsMode: 'edit' }
          }
          case 'activeEventSettingsShow': {
            return { viewEventSettingsMode: 'show' }
          }
          case 'activeParticipantsEdit': {
            return { viewParticipantsMode: 'edit' }
          }
          case 'activeParticipantsShow': {
            return { viewParticipantsMode: 'show' }
          }
          default: return {}
        }
      },
      handleShowMessage: () => (message, type) => {
        return {
          alertMessage: { message: message, variant: type }
        }
      }
    }
  ),
  withStateHandlers(
    (_) => ({}), {
      submitUpdateEventSettingHandler: (_, props) => (values, { setSubmitting, setErrors }) => {
        const { updateEvent, match, handleToggleActiveEdit } = props
        setSubmitting(true)
        delete values.__typename
        const event = {
          name: values.name,
          startDate: values.startDate,
          endDate: values.endDate,
          country: values.country.common,
          city: values.city.value

        }
        updateEvent({
          variables: {
            id: match.params.id,
            event
          }
        }).then(response => {
          if (response && response.data && response.data.updateEvent) {
            handleToggleActiveEdit('activeEventSettingsShow')
          }
        }).catch(exception => {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        })
        setSubmitting(false)
      },
      submitUpdateParticipantsHandler: (_, props) => (values, { setSubmitting, setErrors }) => {
        const { updateEvent, match, handleToggleActiveEdit } = props
        setSubmitting(true)
        const participantsData = JSON.parse(JSON.stringify(values.participants))
        participantsData.forEach(item => {
          delete item.__typename
          if (item._users && item._users.length > 0) {
            let newUserIdArray = []
            item._users.forEach(user => {
              newUserIdArray.push(user._id)
            })
            item.users = newUserIdArray
          }
          delete item._users
          delete item.company
        })

        const event = {
          participants: participantsData
        }
        updateEvent({
          variables: {
            id: match.params.id,
            event
          },
          refetchQueries: [{
            query: QUERY_EVENT,
            variables: {
              id: match.params.id
            }
          }]
        }).then(response => {
          if (response && response.data && response.data.updateEvent) {
            handleToggleActiveEdit('activeParticipantsShow')
          }
        }).catch(exception => {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        })
        setSubmitting(false)
      },
      handleSendEventInvationEmail: (_, props) => (user) => {
        const { sendEventInvitationEmail, handleShowMessage, match } = props
        sendEventInvitationEmail({
          variables: {
            eventId: match.params.id,
            invitedUserId: user._id
          }
        }).then(response => {
          if (response && response.data && response.data.sendEventInvitationEmail && response.data.sendEventInvitationEmail.success) {
            handleShowMessage('Send Email Successfully', 'success')
          }
        }).catch(exception => {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          handleShowMessage(msg, 'error')
        })
      }
    }
  )
)(EventParams)
