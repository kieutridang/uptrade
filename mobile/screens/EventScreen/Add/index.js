import React from 'react'
import { ScrollView, TouchableOpacity, Text, Keyboard } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import * as Yup from 'yup'
import { withFormik } from 'formik'
import { hoistStatics, withState, lifecycle } from 'recompose'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import moment from 'moment'
import store from 'react-native-simple-store'
import { withNetworkCheck } from '../../../utils/hoc'
import { generateId } from '../../../utils/methods'

import { Dropdown } from 'react-native-material-dropdown'
import { TextField } from 'react-native-material-textfield'
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
import DateTimePicker from 'react-native-modal-datetime-picker'
import DropdownHolder from '../../../utils/dropdownHolder'
import { QUERY_COUNTRY } from '../event.typedef'

import CityPicker from '../../../components/CityPicker'

const MUTATION_CREATE_EVENT = gql`
  mutation(
    $event: EventInput!
  ) {
    createEvent(
      event: $event
    ) {
      _id
      name
      startDate
      endDate
      products {
        _id
      }
      imageUrl
      country
      city
      locationName
      createdAt
      updatedAt
    }
  }
`

class AddEventScreen extends React.Component {
  static navigationOptions = (props, a) => {
    const { navigation } = props
    const isSubmitting = navigation.getParam('isSubmitting', false)
    const handleSubmit = navigation.getParam('handleSubmit', () => {})
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: { color: '#fff' },
      title: 'Add new event',
      headerRight: (
        <Button
          loading={isSubmitting}
          loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
          title='SAVE'
          backgroundColor='black'
          titleStyle={{
            fontSize: 12
          }}
          buttonStyle={{
            backgroundColor: 'rgb(219, 84, 97)',
            minWidth: 50
          }}
          containerStyle={{
            marginRight: 9
          }}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      ),
      headerLeft: <Icon name='arrow-back' size={24} color='#fff' onPress={() => navigation.goBack()} />
    }
  };

  componentDidMount () {
    this.props.navigation.setParams({
      isSubmitting: this.props.isSubmitting,
      handleSubmit: this.props.handleSubmit
    })
  }

  render () {
    const { setFieldValue, values, handleChange, errors,
      openStartDatePicker, isStartDatePickerOpen, openEndDatePicker, isEndDatePickerOpen,
      getCityList, isConnected
    } = this.props

    let country = getAllCountries().find(country => country.name.common === values.country)
    let cca2 = 'FR'
    if (country) {
      cca2 = country.cca2
    }

    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingLeft: 10, paddingRight: 10 }}>
        <Text style={{ color: 'red', paddingLeft: 5, paddingRight: 5, marginTop: 5 }}>{errors['form']}</Text>
        <TextField
          name='name'
          label='Name *'
          ref={(input) => { this.nameInput = input }}
          value={`${values.name}`}
          error={errors['name']}
          onChangeText={handleChange('name')}
        />

        <CountryPicker
          name='country'
          cca2={cca2}
          translation='eng'
          filterable
          closeable
          onChange={(country) => { setFieldValue('country', country.name) }}
        >
          <Dropdown
            label='Country'
            value={values.country || 'Click to choose country'}
            disabled
          />
        </CountryPicker>

        <CityPicker
          country={cca2}
          value={values.city}
          error={errors.city}
          onChange={(city) => { setFieldValue('city', city) }}
          getCityList={getCityList}
          isConnected={isConnected}
        />

        <TouchableOpacity
          onPress={() => openStartDatePicker(true)}
        >
          <Dropdown
            label='Start Date'
            value={(values.startDate && moment(values.startDate).format('DD/MM/YYYY')) || 'Click to choose Start Date'}
            disabled
          />
        </TouchableOpacity>

        <DateTimePicker
          isVisible={isStartDatePickerOpen}
          onConfirm={(date) => {
            openStartDatePicker(false)
            setFieldValue('startDate', date)
          }}
          onCancel={() => {
            openStartDatePicker(false)
          }}
        />

        <TouchableOpacity
          onPress={() => openEndDatePicker(true)}
        >
          <Dropdown
            label='End Date'
            value={(values.endDate && moment(values.endDate).format('DD/MM/YYYY')) || 'Click to choose End Date'}
            disabled
          />
        </TouchableOpacity>

        <DateTimePicker
          isVisible={isEndDatePickerOpen}
          onConfirm={(date) => {
            openEndDatePicker(false)
            setFieldValue('endDate', date)
          }}
          onCancel={() => {
            openEndDatePicker(false)
          }}
        />
      </ScrollView>
    )
  }
}

const enhance = compose(
  withNetworkCheck,
  connectActionSheet,
  withState('isStartDatePickerOpen', 'openStartDatePicker', false),
  withState('isEndDatePickerOpen', 'openEndDatePicker', false),
  withState('selectedItems', 'setSelectedItems', []),
  withState('eventsOffline', 'setEventOffline', []),
  withState('userInfo', 'setUserInfo', {}),
  graphql(MUTATION_CREATE_EVENT, {
    name: 'createEvent',
    options: {
      refetchQueries: ['EventList']
    }
  }),
  graphql(QUERY_COUNTRY, {
    name: 'getCityList'
  }),
  lifecycle({
    componentWillMount () {
      store.get('auth').then(data => {
        if (data) {
          this.props.setUserInfo(data.userInfo)
          store.get(`events_${data.userInfo._id}`).then(data => {
            if (data) {
              this.props.setEventOffline(data)
            }
          })
        }
      })
    }
  }),
  withFormik({
    mapPropsToValues: () => ({
      name: '',
      country: 'France',
      city: '',
      startDate: moment().toDate(),
      endDate: moment().toDate()
    }),
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      name: Yup.string().required('This field is mandatory')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
      const { createEvent, navigation, isConnected, userInfo, eventsOffline } = props

      Keyboard.dismiss()
      if (moment(values.startDate).isAfter(values.endDate)) {
        setErrors({
          form: 'Start date cannot be later than end date'
        })
        return
      }

      // disable save button
      setSubmitting(true)
      props.navigation.setParams({
        isSubmitting: true
      })

      if (isConnected) {
        try {
          const response = await createEvent({
            variables: {
              event: values
            }
          })
          if (response.data && response.data.createEvent) {
            if (eventsOffline && eventsOffline.length > 0) {
              const eventsOfflineNew = eventsOffline
              eventsOfflineNew.push(response.data.createEvent)
              store.delete(`events_${userInfo._id}`).then(() => {
                store.save(`events_${userInfo._id}`, eventsOfflineNew)
              })
            } else {
              store.push(`events_${userInfo._id}`, response.data.createEvent)
            }
            navigation.navigate('EventSetting', { eventId: response.data.createEvent._id, isNewEvent: true })
            DropdownHolder.alert('success', 'Create event success', `Event with name ${values.name} is add to event list`)
          }
        } catch (exception) {
          console.warn(exception)
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          if (msg) {
            setErrors({
              form: msg
            })
            console.warn(msg)
          } else {
            console.error(exception)
          }
        }
      } else {
        DropdownHolder.alert('warn', 'Network unstable', 'The network is not stable, we save your data in offline')

        let eventsOffline = []
        await store.get(`events_${userInfo._id}`).then(events => {
          if (Array.isArray(events) && events.length > 0) {
            eventsOffline = events
          }
        })
        const _id = generateId()
        const createdAt = new Date()
        const updatedAt = new Date()
        const event = { _id, ...values, createdAt, updatedAt, isNew: true }
        eventsOffline.push(event)
        await store.delete(`events_${userInfo._id}`).then(() => {
          return store.save(`events_${userInfo._id}`, eventsOffline)
        })

        navigation.navigate('Event')
      }

      // enable save button
      setSubmitting(false)
      props.navigation.setParams({
        isSubmitting: false
      })
    }
  })
)

export default hoistStatics(enhance)(AddEventScreen)
