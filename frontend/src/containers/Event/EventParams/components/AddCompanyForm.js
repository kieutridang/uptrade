import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Icon from '@material-ui/core/Icon'
import { ComponentLoading } from '../../../../components/Loading/index'

import Button from '../../../../components/Button'
import CompanyList from './CompanyList'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 565
  },
  listSection: {
    backgroundColor: 'inherit'
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0
  },
  greenButton: {
    color: 'white',
    background: '#00B9AE',
    minHeight: '31px',
    fontSize: '80%',
    marginTop: '-5px'
  },
  withRightDivider: {
    borderRight: '1px solid black'
  }
})

class AddCompanyForm extends React.Component {
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
      defaultMargin: 0,
      shareFactoryPrice: false,
      shareSupplierDetails: false,
      allowToAddUsers: false,
      allowToSeeOtherCompanies: false
    }
  }

  handleAddNewCompanies = () => {
    const {
      handleModalClose,
      handleToggleActiveEdit,
      activeEdit
    } = this.props
    const {
      IDOfCardActive
    } = this.state

    IDOfCardActive.forEach(company => {
      this.props.helperArray.push(
        this.createDefaultParticipantFromID(company)
      )
    })

    if (!activeEdit) {
      handleToggleActiveEdit && handleToggleActiveEdit('activeParticipantsEdit')
    }

    handleModalClose()
  }

  render () {
    const {
      classes,
      getCompanyCustomers,
      getCompanySuppliers,
      addedCompanies
    } = this.props
    const {
      IDOfCardActive,
      activeCards
    } = this.state
    if (getCompanyCustomers.loading || getCompanySuppliers.loading) {
      return <ComponentLoading />
    } else {
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
        <div className='container'>
          <section className='searchbar'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-6 buttons-row nopadding'>
                  <Button
                    disabled={!IDOfCardActive.length}
                    className={`btn-w-sm ${classes.greenButton}`}
                    handleClick={this.handleAddNewCompanies}
                  >
                    Add Companies
                  </Button>
                </div>
                <div className='col-md-6'>
                  <Icon className='float-right' style={styles.searchIcon}>search</Icon>
                  <TextField className='float-right'
                    placeholder='Search...'
                  />
                </div>
              </div>
            </div>
          </section>
          <div className={`col-sm-6 float-left ${classes.withRightDivider}`}>
            <CompanyList
              title='Customers'
              handleChooseToggle={this.handleChooseToggle}
              dataList={companyCustomers}
              activeCards={activeCards}
            />
          </div>
          <div className={`col-sm-6 float-right`}>
            <CompanyList
              title='Suppliers'
              handleChooseToggle={this.handleChooseToggle}
              dataList={companySuppliers}
              activeCards={activeCards}
            />
          </div>
        </div>
      )
    }
  }
}

AddCompanyForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AddCompanyForm)
