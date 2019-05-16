import React from 'react'
import { View, ScrollView, TouchableOpacity, Alert, BackHandler, Keyboard, Text } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import * as Yup from 'yup'
import { withFormik } from 'formik'
import { hoistStatics, withState, withStateHandlers, lifecycle } from 'recompose'
import { compose, graphql } from 'react-apollo'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import moment from 'moment'
import store from 'react-native-simple-store'
import { withNetworkCheck } from '../../../utils/hoc'

import { Dropdown } from 'react-native-material-dropdown'
import { TextField } from 'react-native-material-textfield'
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
import DateTimePicker from 'react-native-modal-datetime-picker'

import Participants from './components/Participants'
import CityPicker from '../../../components/CityPicker'

// import HardcodeList from '../../../constants/HardcodeList'
import { QUERY_COUNTRY, QUERY_EVENT, MUTATION_UPDATE_EVENT, QUERY_COMPANY_CUSTOMERS, QUERY_COMPANY_SUPPLIERS, MUTATION_SEND_EVENT_INVITATION_EMAIL } from '../event.typedef'
import DropdownHolder from '../../../utils/dropdownHolder'

class EventSettingScreen extends React.Component {
  static navigationOptions = (props, a) => {
    const { navigation } = props
    const isNewEvent = navigation.getParam('isNewEvent', null)
    const isSubmitting = navigation.getParam('isSubmitting', false)
    const handleSubmit = navigation.getParam('handleSubmit', () => {})
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
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
      headerTitleStyle: { color: '#fff' },
      title: 'Event Settings',
      headerLeft: <Icon name='arrow-back' size={24} color='#fff' onPress={() => (isNewEvent ? navigation.navigate('Event') : navigation.goBack())} />
    }
  };

  _handleBackPress = () => {
    return this.props.navigation.navigate('Event')
  }

  getEventIsNew = (props) => {
    const { eventsOffline, navigation } = props
    const eventId = navigation.getParam('eventId', null)
    const event = eventsOffline && eventsOffline.find(event => event._id === eventId)
    if (event) {
      return event.isNew
    }
    return false
  }

  componentDidMount () {
    this.props.navigation.setParams({
      isSubmitting: this.props.isSubmitting,
      handleSubmit: this.props.handleSubmit
    })
    if (this.props.navigation.getParam('isNewEvent', null)) {
      BackHandler.addEventListener('hardwareBackPress', this._handleBackPress)
    }
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress)
  }

  render () {
    const { setFieldValue, values, handleChange, errors,
      openStartDatePicker, isStartDatePickerOpen, openEndDatePicker, isEndDatePickerOpen,
      getEvent, getCompanyCustomers, getCompanySuppliers, handleSendEventInvitationEmail, getCityList, isConnected
    } = this.props
    let country = getAllCountries().find(country => country.name.common === values.country)
    let cca2 = 'FR'
    const isNew = this.getEventIsNew(this.props)
    if (country) {
      cca2 = country.cca2
    }
    if (getEvent.loading) {
      return null
    }
    return (
      <ScrollView style={{ flex: 1, height: 200, paddingLeft: 5, paddingRight: 5 }}>
        <Text style={{ color: 'red', paddingLeft: 5, paddingRight: 5, marginTop: 5 }}>{errors['form']}</Text>
        <View style={{ flex: 1, backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, margin: 10 }}>
          <TextField
            name='name'
            label='Name *'
            ref={(input) => { this.nameInput = input }}
            value={values.name}
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
            date={new Date(values.startDate)}
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
            date={new Date(values.endDate)}
            isVisible={isEndDatePickerOpen}
            onConfirm={(date) => {
              openEndDatePicker(false)
              setFieldValue('endDate', date)
            }}
            onCancel={() => {
              openEndDatePicker(false)
            }}
          />
        </View>
        {/* if don't connect or event haven't sync then block */}
        {isConnected && !isNew
          ? <Participants
            values={values}
            getCompanyCustomers={getCompanyCustomers}
            getCompanySuppliers={getCompanySuppliers}
            handleSendEventInvitationEmail={handleSendEventInvitationEmail}
            {...this.props}
          /> : null }
      </ScrollView>
    )
  }
}

const enhance = compose(
  connectActionSheet,
  withNetworkCheck,
  withState('isStartDatePickerOpen', 'openStartDatePicker', false),
  withState('isEndDatePickerOpen', 'openEndDatePicker', false),
  withState('eventsOffline', 'setEvents', []),
  withState('userInfo', 'setUserInfo', {}),
  lifecycle({
    componentWillMount () {
      store.get('auth').then(data => {
        if (data) {
          this.props.setUserInfo(data.userInfo)
          store.get(`events_${data.userInfo._id}`).then(data => {
            this.props.setEvents(data)
          })
        }
      })
    }
  }),
  graphql(QUERY_EVENT, {
    name: 'getEvent',
    options: props => {
      const eventId = props.navigation.getParam('eventId', null)
      return {
        variables: {
          id: eventId
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
    name: 'updateEvent',
    options: {
      refetchQueries: ['EventList']
    }
  }),
  graphql(QUERY_COUNTRY, {
    name: 'getCityList'
  }),
  graphql(MUTATION_SEND_EVENT_INVITATION_EMAIL, {
    name: 'sendEventInvitationEmail'
  }),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
      const { isConnected } = props
      if (isConnected) {
        return loadEventDetailOnline(props)
      } else {
        return loadEventDetailOffline(props)
      }
    },
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      name: Yup.string().required('This field is mandatory')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
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

      const { isConnected, eventsOffline, navigation } = props
      const eventId = navigation.getParam('eventId', null)
      let isNew = false
      const eventOffline = eventsOffline && eventsOffline.find(event => event._id === eventId)
      if (eventOffline) {
        isNew = eventOffline.isNew
      }

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
        name: values.name,
        startDate: values.startDate,
        endDate: values.endDate,
        country: values.country,
        city: values.city,
        participants: participantsData
      }

      try {
        if (isConnected && !isNew) {
          await editEventOnline(props, event)
        } else {
          await editEventOffline(props, event)
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
      // enable save button
      setSubmitting(false)
      props.navigation.setParams({
        isSubmitting: false
      })
    }
  }),
  withStateHandlers((_) => ({ }), {
    handleSendEventInvitationEmail: (_, props) => (user) => {
      const { sendEventInvitationEmail } = props
      const eventId = props.navigation.getParam('eventId', null)
      sendEventInvitationEmail({
        variables: {
          eventId,
          invitedUserId: user._id
        }
      }).then(response => {
        if (response && response.data && response.data.sendEventInvitationEmail && response.data.sendEventInvitationEmail.success) {
          Alert.alert('Send Email Successfully', `success`)
        }
      }).catch(exception => {
        const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
        Alert.alert(msg, `error`)
      })
    }
  })
)

export default hoistStatics(enhance)(EventSettingScreen)

function getLatestEvent (firstEvent, secondEvent) {
  try {
    if (!firstEvent.createdAt && secondEvent.createdAt) {
      return secondEvent
    }
    if (firstEvent.createdAt && !secondEvent.createdAt) {
      return firstEvent
    }
    if (firstEvent.createdAt < secondEvent.createdAt) return secondEvent
    if (firstEvent.createdAt > secondEvent.createdAt) return firstEvent
    if (firstEvent.updatedAt < secondEvent.updatedAt) return secondEvent
    if (firstEvent.updatedAt > secondEvent.updatedAt) return firstEvent
    // if first == second
    if (firstEvent) return firstEvent
    return {
      name: '',
      startDate: '',
      endDate: '',
      country: '',
      city: '',
      participants: []
    }
  } catch (error) {
    console.warn('EventScreen/Settings/index.js', 'getLatestEvent', error)
  }
}

function loadEventDetailOnline (props) {
  try {
    const { getEvent, eventsOffline, navigation } = props
    const eventDetailOnline = getEvent.event || {}
    const eventId = navigation.getParam('eventId', null)
    const eventDetailOffline = (Array.isArray(eventsOffline) && eventsOffline.find(event => event._id === eventId)) || {}

    const eventDetail = getLatestEvent(eventDetailOnline, eventDetailOffline)
    return {
      name: eventDetail.name,
      startDate: eventDetail.startDate,
      endDate: eventDetail.endDate,
      country: eventDetail.country,
      city: eventDetail.city,
      participants: eventDetail.participants || []
    }
  } catch (error) {
    console.warn('EventScreen/Settings/index.js', 'loadEventDetailOnline', error)
  }
}

function loadEventDetailOffline (props) {
  try {
    const { eventsOffline, navigation } = props
    const events = eventsOffline
    const eventId = navigation.getParam('eventId', null)
    const event = events && events.find(event => event._id === eventId)
    if (event) {
      return {
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate,
        country: event.country,
        city: event.city,
        participants: event.participants || []
      }
    }
    return {
      name: '',
      startDate: '',
      endDate: '',
      country: '',
      city: '',
      participants: []
    }
  } catch (error) {
    console.warn('EventScreen/Settings/index.js', 'loadEventDetailOffline', error)
  }
}

async function editEventOffline (props, event) {
  try {
    const { eventsOffline, navigation, userInfo } = props
    const eventId = navigation.getParam('eventId', null)
    if (eventsOffline) {
      let newEventsOffline = eventsOffline.map(element => {
        if (element._id === eventId) {
          return {
            ...element,
            ...event,
            isNew: true,
            updatedAt: new Date()
          }
        }
        return element
      })
      await store.delete(`events_${userInfo._id}`).then(() => {
        return store.save(`events_${userInfo._id}`, newEventsOffline)
      })
    }
    DropdownHolder.alert('warn', 'Network unstable', 'The network is not stable or your event is not sync, we save your data in offline')
    navigation.navigate('ProductsEvent', { eventId, eventName: event.name })
  } catch (error) {
    console.warn('EventScreen/Settings/index.js', 'editEventOffline', error)
  }
}

async function editEventOnline (props, event) {
  try {
    const { updateEvent, navigation } = props
    const eventId = navigation.getParam('eventId', null)
    const response = await updateEvent({
      variables: {
        id: eventId,
        event
      }
    })
    if (response.data && response.data.updateEvent) {
      Alert.alert('Update event success', `Event with name ${event.name} is updated`)
      navigation.navigate('ProductsEvent', { eventId, eventName: event.name })
    }
  } catch (error) {
    console.warn('EventScreen/Settings/index.js', 'editEventOnline', error)
  }
}
