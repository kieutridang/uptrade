import React from 'react'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'

import FormModel from '../../../components/FormModel'
import EventSettings from './components/EventSettings'
import { QUERY_EVENTS, MUTATION_CREATE_EVENT, QUERY_COUNTRY } from '../event.typedef'
import { initialEventValues } from '../event.initialValues'
import { eventValidationSchema } from '../event.validation'

class EventCreate extends React.Component {
  render () {
    const { submitUpdateEventSettingHandler } = this.props
    return (
      <article className='article products closebox'>
        <div style={{ padding: 24, backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 104px)' }}>
          <div className='row'>
            <div className='col-sm-12'>
              <FormModel
                initialValues={initialEventValues}
                schema={eventValidationSchema}
                submitHandler={submitUpdateEventSettingHandler}
                component={<EventSettings
                  {...this.props}
                />}
              />
            </div>
          </div>
        </div>
      </article>
    )
  }
}

export default compose(
  graphql(MUTATION_CREATE_EVENT, {
    name: 'createEvent'
  }),
  graphql(QUERY_COUNTRY, {
    name: 'getCityList'
  }),
  withStateHandlers(
    (_) => ({}), {
      submitUpdateEventSettingHandler: (_, props) => async (values, { setSubmitting, setErrors }) => {
        const { createEvent } = props
        const event = {
          name: values.name,
          startDate: values.startDate,
          endDate: values.endDate,
          country: values.country && values.country.common,
          city: values.city && values.city.value
        }

        setSubmitting(true)
        if (values.startDate > values.endDate) {
          setErrors({
            form: 'Start date cannot be after end date'
          })
        } else {
          try {
            const response = await createEvent({
              variables: {
                event
              },
              refetchQueries: [{
                query: QUERY_EVENTS,
                variables: {
                  page: 1,
                  limit: 1000
                }
              }]
            })

            if (response && response.data && response.data.createEvent) {
              props.history.push(`/events/parameters/${response.data.createEvent._id}`)
            }
          } catch (exception) {
            const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
            setErrors({
              form: msg
            })
          }
        }
        setSubmitting(false)
      }
    }
  )
)(EventCreate)
