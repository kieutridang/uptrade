import React from 'react'
import PropTypes from 'prop-types'
import {
  FormControlLabel,
  Switch,
  Avatar,
  Chip
} from '@material-ui/core'
import {
  Send as SendIcon,
  Close as CloseIcon,
  Message as MessageICon,
  AccountCircle as FaceIcon
} from '@material-ui/icons'
import { Field } from 'formik'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'

import FormModel from '../FormModel'
import Input from '../Input'
import SelectSearch from '../SelectSearch'
import SnackBar from '../Snackbar/index'

import Button from '../../components/Button'

import { QUERY_COMPANY_USER, QUERY_CUSTOMER_USER, QUERY_SUPPLIER_USER, QUERY_COMPANY_PRODUCTS, MUTATION_CREATE_TOPIC, MUTATION_CREATE_CHAT, QUERY_EVENTS, QUERY_TOPICS } from './slidebar.typedef'
import { topicValidationSchema } from './slidebar.validations'

import './index.scss'

const initialValues = { title: '', message: '', user: '', productId: '' }

const ChatForm = (props) => {
  const {
    getCompanyUser,
    handleRemoveSelectUser,
    usersOptions,
    handleSubmit,
    handleSelectUser,
    selectUserList,
    showErrorSelectUser,
    productsOptions,
    getCompanyProducts,
    handleSelectProduct,
    userSelected,
    productSelected
  } = props
  return (
    <form onSubmit={handleSubmit} style={{ height: '100%', overflow: 'auto' }}>
      <Field
        name='user'
        label='Search and add'
        className='w-100 side-bar-input'
        component={SelectSearch}
        isLoading={getCompanyUser.isLoading}
        options={usersOptions}
        onChange={handleSelectUser}
        margin='normal'
        value={userSelected || ''}
      />
      <div className='mt-4 mb-4 slide-bar-chips'>
        {
          selectUserList && selectUserList.map(user => (
            <Chip
              key={user._id}
              avatar={user.avatar ? <Avatar alt='Natacha' src={user.avatar} /> : <Avatar><FaceIcon /></Avatar>}
              label={`${user.firstName} ${user.lastName}`}
              onDelete={handleRemoveSelectUser(user)}
              color='primary'
              clickable
              className='slide-bar-chip'
            />
          ))
        }
      </div>
      {showErrorSelectUser && <span className='error-message'>User has selected</span>}
      <hr className='mt-4' />
      <Field
        name='productId'
        label='Product'
        className='w-100 side-bar-input'
        component={SelectSearch}
        isLoading={getCompanyProducts.isLoading}
        options={productsOptions}
        onChange={handleSelectProduct}
        margin='normal'
        value={productSelected || ''}
      />
      <div className=''>
        <Field
          name='title'
          label='Subject'
          className='w-100 side-bar-input'
          component={Input}
          margin='normal'
        />
        <Field
          name='message'
          label='Message'
          className='w-100 mt-4 side-bar-textarea'
          component={Input}
          margin='normal'
          multiline
          rows='4'
        />
      </div>
      <div className='text-center'>
        <Button type='submit' className='text-white btn-start-chat mt-3 text-uppercase'>START CHAT <SendIcon className='ml-1' /></Button>
      </div>
    </form>
  )
}

class SlideBar extends React.PureComponent {
  state = {
    show: false,
    switchUser: false,
    userByCustomers: [],
    userBySuppliers: [],
    selectUserList: [],
    showErrorSelectUser: false,
    productId: null,
    userSelected: null,
    productSelected: null,
    usersOptions: []
  }
  componentWillReceiveProps (nextProps) {
    const { switchUser } = this.state
    const { getCustomerUser, getSupplierUser, getCompanyUser } = nextProps
    const { userBySuppliers } = getSupplierUser
    const { userByCustomers } = getCustomerUser
    const { userByCompany } = getCompanyUser

    let usersOptions = []

    usersOptions = userByCompany && userByCompany.users && userByCompany.users.map(user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` }))
    if (!switchUser) {
      if (userByCustomers) {
        const listUsers = userByCustomers.map(user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` }))
        usersOptions = usersOptions && usersOptions.concat(listUsers)
      }
      if (userBySuppliers) {
        const listUsers = userBySuppliers.map(user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` }))
        usersOptions = usersOptions && usersOptions.concat(listUsers)
      }
    }
    this.setState({ usersOptions })
  }
  handleToggleSlide = () => {
    this.setState({ show: !this.state.show })
  }
  render () {
    const {
      handleDelete,
      getCompanyProducts,
      getEvents,
      alertMessage
    } = this.props
    const { companyProducts } = getCompanyProducts
    const { events } = getEvents

    const { show, switchUser, selectUserList, showErrorSelectUser, userSelected, productSelected, usersOptions } = this.state

    let productsOptions = []

    productsOptions = companyProducts && companyProducts.products && companyProducts.products.map(product => ({ value: product._id, label: product.essentials.itemName }))

    events && events.events && events.events.forEach(event => {
      if (event.products) {
        const listProducts = event.products.map(product => ({ value: product._id, label: product.essentials.itemName }))
        productsOptions = productsOptions && productsOptions.concat(listProducts)
      }
    })
    return (
      <div>
        {alertMessage.message && <SnackBar message={alertMessage.message} variant={alertMessage.variant} />}
        <div className={`slide-bar-open-icon ${show ? 'slide-bar-open-icon-open' : 'slide-bar-open-icon-close'}`} onClick={this.handleToggleSlide}>
          <MessageICon />
        </div>
        <div className={`w-100 h-100  ${show ? 'slide-bar-open' : 'slide-bar-close'} slide-bar`}>
          <CloseIcon onClick={this.handleToggleSlide} className='slide-bar-close-icon' />
          <div className='slide-bar-header'>
            <p className='slide-bar-header'>MESSAGE</p>
            <h5 className='small'>Send a message about this element to your supplier, customer or colleague.</h5>
          </div>
          <hr className='mt-4' />
          <div>
            <p>Contacts</p>
            <FormControlLabel
              labelPlacement='start'
              label='Internal Only'
              className='slide-bar-switch w-100 justify-content-between m-0 p-0'
              control={
                <Switch
                  classes={switchUser ? { iconChecked: 'iconChecked', root: 'root' } : { iconChecked: 'iconChecked' }}
                  checked={switchUser}
                  onChange={this.switchChangeHandler}
                />
              }
            />
          </div>
          <FormModel
            schema={topicValidationSchema}
            initialValues={initialValues}
            submitHandler={this.handleSubmitCreateTopic}
            component={<ChatForm
              handleDelete={handleDelete}
              productsOptions={productsOptions}
              usersOptions={usersOptions}
              selectUserList={selectUserList}
              showErrorSelectUser={showErrorSelectUser}
              userSelected={userSelected}
              productSelected={productSelected}
              handleSelectProduct={this.handleSelectProduct}
              handleRemoveSelectUser={this.handleRemoveSelectUser}
              handleSelectUser={this.handleSelectUser}
              {...this.props}
            />}
          />
        </div >
      </div>
    )
  }
  switchChangeHandler = (event, checked) => {
    this.setState({ switchUser: checked })
    if (checked) {
      const { getCompanyUser } = this.props
      const { userByCompany } = getCompanyUser
      const usersOptions = userByCompany && userByCompany.users && userByCompany.users.map(user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` }))

      this.setState({ usersOptions })
    } else {
      const { getCustomerUser, getSupplierUser, getCompanyUser } = this.props
      const { userBySuppliers } = getSupplierUser
      const { userByCustomers } = getCustomerUser
      const { userByCompany } = getCompanyUser

      let usersOptions = []

      usersOptions = userByCompany && userByCompany.users && userByCompany.users.map(user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` }))
      if (userByCustomers) {
        const listUsers = userByCustomers.map(user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` }))
        usersOptions = usersOptions && usersOptions.concat(listUsers)
      }
      if (userBySuppliers) {
        const listUsers = userBySuppliers.map(user => ({ value: user._id, label: `${user.firstName} ${user.lastName}` }))
        usersOptions = usersOptions && usersOptions.concat(listUsers)
      }
      this.setState({ usersOptions })
    }
  }
  handleSubmitCreateTopic = async (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true)
    try {
      const { title, message } = values
      const { selectUserList, productId } = this.state
      const usersIds = selectUserList.map(user => user._id)
      const { createTopic, createChat, handleShowMessage } = this.props

      const currentUserId = window.localStorage.getItem('userID')
      usersIds.push(currentUserId)

      const topic = {
        title,
        usersIds,
        productId
      }
      const response = await createTopic({
        variables: {
          topic
        }

      }).then(topic => {
        const { _id } = topic.data.createTopic
        return createChat({
          variables: {
            chat: {
              message,
              involvedUsersIds: usersIds,
              topicId: _id
            }
          }
        })
      })
      if (response && response.data && response.data.createChat) {
        this.setState({ productId: null, selectUserList: [], productSelected: null, userSelected: null, showErrorSelectUser: false })
        resetForm(initialValues)
        handleShowMessage('Create chat topic successfully', 'success')
        this.handleToggleSlide()
      }
    } catch (exception) {
      const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
      setErrors({
        form: msg
      })
    }
    setSubmitting(false)
  }
  handleRemoveSelectUser = (user) => () => {
    let newSelectUserList = JSON.parse(JSON.stringify(this.state.selectUserList))
    const userToRemove = newSelectUserList.indexOf(user)
    newSelectUserList.splice(userToRemove, 1)
    this.setState({ selectUserList: newSelectUserList })
  }
  handleSelectUser = (e) => {
    const { getCustomerUser, getSupplierUser, getCompanyUser } = this.props
    const { userBySuppliers } = getSupplierUser
    const { userByCustomers } = getCustomerUser
    const { userByCompany } = getCompanyUser
    let listUser = userByCompany.users

    if (userBySuppliers) {
      listUser = listUser.concat(userBySuppliers)
    }
    if (userByCustomers) {
      listUser = listUser.concat(userByCustomers)
    }

    let newSelectUserList = JSON.parse(JSON.stringify(this.state.selectUserList))
    const userSelectedExist = newSelectUserList.filter(user => user._id === e.value)

    if (userSelectedExist.length < 1) {
      const userSelected = listUser.filter(user => user._id === e.value)
      newSelectUserList = newSelectUserList.concat(userSelected)

      this.setState({ selectUserList: newSelectUserList, showErrorSelectUser: false, userSelected: { value: e.value, label: e.label } })
    } else {
      this.setState({ showErrorSelectUser: true })
    }
  }
  handleSelectProduct = (e) => {
    this.setState({ productId: e.value, productSelected: { value: e.value, label: e.label } })
  }
}

SlideBar.propTypes = {
  switchSlideBar: PropTypes.bool,
  selectValue: PropTypes.string,
  subjectValue: PropTypes.string,

  currencies: PropTypes.array,

  handleDelete: PropTypes.func,
  switchChangeHandler: PropTypes.func,
  selectChangeHandler: PropTypes.func,
  subjectChangeHandler: PropTypes.func
}

export default compose(
  graphql(QUERY_COMPANY_USER, {
    name: 'getCompanyUser'
  }),
  graphql(QUERY_CUSTOMER_USER, {
    name: 'getCustomerUser'
  }),
  graphql(QUERY_SUPPLIER_USER, {
    name: 'getSupplierUser'
  }),
  graphql(
    QUERY_COMPANY_PRODUCTS,
    {
      name: 'getCompanyProducts',
      options: {
        variables: {
          limit: 0,
          companyUptradeID: window.localStorage.getItem('companyUptradeID')
        }
      }
    }
  ),
  graphql(
    QUERY_EVENTS,
    {
      name: 'getEvents',
      options: {
        variables: {
          limit: 0
        }
      }
    }
  ),
  graphql(QUERY_TOPICS, {
    name: 'getTopics',
    options: props => {
      return {
        variables: {
          page: 1,
          limit: 10
        }
      }
    }
  }),
  graphql(MUTATION_CREATE_CHAT, { name: 'createChat' }),
  graphql(MUTATION_CREATE_TOPIC,
    {
      name: 'createTopic',
      options: {
        refetchQueries: ['ListTopic']
      }
    }),
  withStateHandlers(({
    alertMessage = {
      message: '',
      variant: ''
    }
  }) => ({
    alertMessage
  }), {
    handleShowMessage: () => (message, type) => {
      return {
        alertMessage: { message: message, variant: type }
      }
    }
  })
)(SlideBar)
