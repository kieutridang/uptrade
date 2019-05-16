import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Icon, ListItem } from 'react-native-elements'
import { FieldArray } from 'formik'
import { hoistStatics } from 'recompose'
import { compose } from 'react-apollo'
import { connectActionSheet } from '@expo/react-native-action-sheet'

class Participants extends React.Component {
  constructor () {
    super()
    this.state = {
      helperArrayMethod: undefined,
      userOfParticipants: [],
      usersOfCompany: []
    }
  }
  getParticipantInfo = (companyId, index) => {
    const { getCompanyCustomers, getCompanySuppliers, values } = this.props
    const companyCustomerArray = getCompanyCustomers.companyCustomers.customers
    const companySupplierArray = getCompanySuppliers.companySuppliers.suppliers

    if (index === 0) {
      return {
        name: 'My team',
        logo: values.participants[0].company.about.logo,
        description: 'Users from your Uptrade account'
      }
    }

    const isSupplier = companySupplierArray.find((company) => (company.companyId === companyId))
    const isCustomer = companyCustomerArray.find((company) => (company.companyId === companyId))
    const instance = isSupplier || isCustomer

    let description = ''
    if (isSupplier && isCustomer) {
      description = 'Customer & Supplier'
    } else {
      description = isCustomer ? 'Customer' : 'Supplier'
    }
    return {
      name: instance._company.about.name,
      logo: instance._company.about.logo,
      description
    }
  }
  getUsersOfCompany = (company) => {
    const { getCompanyCustomers, getCompanySuppliers } = this.props
    const companyCustomerArray = getCompanyCustomers.companyCustomers.customers
    const companySupplierArray = getCompanySuppliers.companySuppliers.suppliers
    const isSupplier = companySupplierArray.find((instance) => (instance.companyId === company.companyId))
    const isCustomer = companyCustomerArray.find((instance) => (instance.companyId === company.companyId))

    const instance = isSupplier || isCustomer
    let usersOfCompany = []
    if (company.company) {
      usersOfCompany = company.company._users || []
      usersOfCompany = usersOfCompany.concat(company.company._admins)
    } else {
      usersOfCompany = instance._company._users || []
      usersOfCompany = usersOfCompany.concat(instance._company._admins)
    }
    return usersOfCompany
  }
  handleChangeCompanyData = (companyIndex, value) => {
    const { setFieldValue } = this.props
    setFieldValue(`participants[${companyIndex}]`, value)
  }
  updateCompanyList = (newCompanyList) => {
    const { setFieldValue } = this.props
    setFieldValue('participants', newCompanyList)
  }
  render () {
    const {
      values = {},
      getCompanyCustomers,
      getCompanySuppliers,
      handleSendEventInvitationEmail,
      navigation
    } = this.props
    if (getCompanyCustomers.loading || getCompanySuppliers.loading) {
      return null
    }
    return (
      <View style={styles.baseContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            Participants
          </Text>
          <Icon name='add' size={24} color='#777777' onPress={() => navigation.navigate('EventAddCompanies', {
            addedCompanies: values.participants,
            getCompanyCustomers: getCompanyCustomers,
            getCompanySuppliers: getCompanySuppliers,
            updateCompanyList: this.updateCompanyList
          })} />
        </View>
        <View style={styles.bodyContainer}>
          <FieldArray
            name='participants'
            render={arrayHelpers => (
              <View style={{ flex: 1 }}>
                <View>
                  {
                    values.participants.map((company, index) => {
                      const { name, logo, description } = this.getParticipantInfo(company.companyId, index)
                      return (
                        <ListItem
                          key={`participant-item_${index}`}
                          leftAvatar={{ source: { uri: logo || 'https://placeimg.com/640/480/any' } }}
                          title={name}
                          subtitle={description}
                          onPress={() => navigation.navigate('CompanyParticipants', {
                            company,
                            name,
                            logo,
                            description,
                            index,
                            usersOfCompany: this.getUsersOfCompany(company),
                            handleSendEventInvitationEmail,
                            handleChangeCompanyData: this.handleChangeCompanyData
                          })}
                        />
                      )
                    })
                  }
                </View>
              </View>
            )}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    margin: 10
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    borderBottomWidth: 1
  },
  headerTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.87)'
  },
  sectionContainer: {
    flex: 1,
    padding: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)'
  },
  sectionHeaderInactive: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15
  },
  sectionHeaderActive: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)'
  },
  participantLogo: {
    flex: 1
  },
  participantName: {
    flex: 2,
    fontWeight: 'bold'
  },
  participantDescription: {
    flex: 7,
    color: 'rgba(0, 0, 0, 0.54)'
  },
  fieldContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10
  },
  fieldLabel: {
    flex: 1
  },
  bodyContainer: {
    flex: 1
  }
})

const enhance = compose(
  connectActionSheet
)

export default hoistStatics(enhance)(Participants)
