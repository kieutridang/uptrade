import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Icon, Button, SearchBar } from 'react-native-elements'

import CompanyList from './CompanyList'

class AddCompanyForm extends React.Component {
  static navigationOptions = (props, a) => {
    const { navigation } = props
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: { color: '#fff' },
      title: 'Event Settings / Add Companies',
      headerLeft: <Icon name='arrow-back' size={30} color='#fff' onPress={() => navigation.goBack()} />
    }
  }
  constructor () {
    super()
    this.state = {
      IDOfCardActive: [],
      activeCards: {}
    }
  }

  handleChooseToggle = (cardID) => {
    let currentIDOfCardActive = this.state[`IDOfCardActive`]
    const { activeCards } = this.state
    if (!activeCards[`cardActive_${cardID}`]) {
      currentIDOfCardActive.push(cardID)
    } else {
      currentIDOfCardActive = currentIDOfCardActive.filter(card => card !== cardID)
    }

    this.setState({
      activeCards: {
        ...activeCards,
        [`cardActive_${cardID}`]: !activeCards[`cardActive_${cardID}`]
      },
      [`IDOfCardActive`]: currentIDOfCardActive
    })
  }

  createDefaultParticipantFromID = (companyId) => {
    return {
      companyId,
      users: [],
      _users: [],
      defaultMargin: 0,
      shareFactoryPrice: false,
      shareSupplierDetails: false,
      allowToAddUsers: false,
      allowToSeeOtherCompanies: false
    }
  }

  handleAddNewCompanies = () => {
    const { navigation } = this.props
    const params = navigation.state.params
    const {
      addedCompanies,
      updateCompanyList
    } = params
    const {
      IDOfCardActive
    } = this.state

    let newCompanyList = JSON.parse(JSON.stringify(addedCompanies))

    IDOfCardActive.forEach(company => {
      newCompanyList.push(
        this.createDefaultParticipantFromID(company)
      )
    })

    updateCompanyList(newCompanyList)

    navigation.goBack()
  }

  render () {
    const { navigation } = this.props
    const params = navigation.state.params
    const {
      getCompanyCustomers,
      getCompanySuppliers,
      addedCompanies
    } = params
    const {
      activeCards
    } = this.state

    const companyCustomerArray = getCompanyCustomers.companyCustomers.customers
    const companySupplierArray = getCompanySuppliers.companySuppliers.suppliers
    const adddedCompanyIDArray = addedCompanies.map(participant => participant.companyId)
    const companyCustomers = companyCustomerArray.filter((company, index, arr) => {
      return (!adddedCompanyIDArray.includes(company.companyId) && arr.indexOf(company) === index)
    })
    const companySuppliers = companySupplierArray.filter((company, index, arr) => {
      return (!adddedCompanyIDArray.includes(company.companyId) && arr.indexOf(company) === index)
    })

    return (
      <ScrollView style={styles.container}>
        <SearchBar
          showLoading={false}
          platform='ios'
          cancelButtonTitle='Cancel'
          placeholder='Filter companies...'
        />
        <View style={styles.companyListContainer}>
          <CompanyList
            title='Customers'
            handleChooseToggle={this.handleChooseToggle}
            dataList={companyCustomers}
            activeCards={activeCards}
          />
          <CompanyList
            title='Suppliers'
            handleChooseToggle={this.handleChooseToggle}
            dataList={companySuppliers}
            activeCards={activeCards}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title='Add Companies'
            loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.buttonContainerStyle}
            onPress={this.handleAddNewCompanies}
          />
          <Button
            title='Cancel'
            loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.buttonContainerStyle}
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5
  },
  textField: {
    flex: 1
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonStyle: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    elevation: 0
  },
  buttonContainerStyle: {
    paddingLeft: 5,
    paddingRight: 5
  },
  companyListContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  }
})

export default AddCompanyForm
