import React, { Component } from 'react'
import Button from '../../components/Button'
import CheckBox from '../../components/CheckBox'
import RadioButton from '../../components/RadioButton'
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm'
import ChatBubbleOutline from '@material-ui/icons/ChatBubbleOutline'
import NavigationBar from '../../components/NavigationBar'
import SlideBar from '../../components/SlideBar'
import SideBar from '../../components/SideBar'
import Multitabs from '../../components/Multitabs'
import AddSearch from '../../components/SearchBars/AddSearch'
import AddSearchUpDown from '../../components/SearchBars/AddSearchUpDown'
import FileUpload from '../../components/FileUpload'
import FiltSearchCat from '../../components/SearchBars/FiltSearchCat/index'
import AddInline from '../../components/InlineBars/AddInline/index'

import RegisterPage from './Register'

import './index.scss'
import ClientTable from '../../components/List'

// Data for the table to display; can be anything
const data = [
  {
    company: {
      type: 'string',
      val: 'Dragon Mountain Ltd.'
    },
    uptradeId: {
      type: 'string',
      val: 'DML'
    },
    registrationType: {
      type: 'string',
      val: 'Manual'
    },
    activeUser: {
      type: 'string',
      val: 8
    },
    status: {
      type: 'string',
      val: 'Active'
    }
  },
  {
    company: {
      type: 'string',
      val: 'Client #2'
    },
    uptradeId: {
      type: 'string',
      val: 'CL02'
    },
    registrationType: {
      type: 'string',
      val: 'Manual'
    },
    activeUser: {
      type: 'string',
      val: 2
    },
    status: {
      type: 'string',
      val: 'Inactive'
    }
  },
  {
    company: {
      type: 'string',
      val: 'Client #3'
    },
    uptradeId: {
      type: 'string',
      val: 'K007'
    },
    registrationType: {
      type: 'string',
      val: 'Self Registration'
    },
    activeUser: {
      type: 'string',
      val: 15
    },
    status: {
      type: 'string',
      val: 'Active'
    }
  }
]

// Fields to show in the table, and what object properties in the data they bind to
const fields = [
  {
    name: 'company',
    displayName: 'Company',
    inputFilterable: true,
    sortable: true
  },
  {
    name: 'uptradeId',
    displayName: 'Uptrade ID',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'registrationType',
    displayName: 'Registration Type',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'activeUser',
    displayName: 'Active User',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'status',
    displayName: 'Status',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  }
]

const currencies = [
  {
    value: '',
    label: ''
  }
]
const tabList = [
  { label: 'COMPANY' },
  { label: 'BUYER AI' },
  { label: 'USERS' },
  { label: 'USER SETTINGS' },
  { label: 'NOTIFICATIONS' },
  { label: 'PRODUCTS' },
  { label: 'ITEM SIX' },
  { label: 'ITEM SEVEN' },
  { label: 'ITEM EIGHT' },
  { label: 'ITEM NINE' },
  { label: 'ITEM TEN' }
]

class Virtual extends Component {
  state = {
    checked: false,
    selectedValue: 'A',
    disabled: false,
    switchSlideBar: false,
    selectValue: '',
    subjectValue: '',
    currentTab: 0
  }
  render (props) {
    const {
      checked,
      disabled,
      selectedValue,
      subjectValue,
      switchSlideBar,
      currentTab
    } = this.state

    return (
      <div className='virtual-container'>
        <SideBar />
        <NavigationBar />
        <h1 className='title'>This is Virtual Component</h1>
        <AccessAlarmIcon />
        <ChatBubbleOutline />
        <div className='item'>
          <h3 className='item-title'>Buttons</h3>
          <Button handleClick={this.handleClick} className='primary'>
            Primary
          </Button>
          <Button handleClick={this.handleClick} className='secondary'>
            Secondary
          </Button>
        </div>
        <div className='item'>
          <h3 className='item-title'>Form Model</h3>
          <RegisterPage />
        </div>
        <div className='item'>
          <h3 className='item-title'>Check box</h3>
          <CheckBox
            value='checkbox'
            label='checkbox label'
            color='primary'
            checked={checked}
            disabled={disabled}
            handleClick={this.handleClickCheckbox}
          />
          <CheckBox
            value='checkbox'
            label='checkbox label'
            color='secondary'
            checked={checked}
            disabled={disabled}
            handleClick={this.handleClickCheckbox}
          />
          <CheckBox
            value='checkbox'
            label='checkbox label'
            color='secondary'
            checked={checked}
            indeterminate
            disabled={disabled}
            handleClick={this.handleClickCheckbox}
          />
          <CheckBox
            value='checkbox'
            label='checkbox label'
            checked={checked}
            disabled={disabled}
            handleClick={this.handleClickCheckbox}
          />
        </div>
        <div className='item'>
          <h3 className='item-title'>Radio button</h3>
          <RadioButton
            label='radio button'
            value='A'
            color='green'
            disabled={disabled}
            checked={selectedValue === 'A'}
            labelPlacement='start'
            handleClick={this.handleClickRadio}
          />
          <RadioButton
            label='radio button'
            value='B'
            color='primary'
            disabled={disabled}
            checked={selectedValue === 'B'}
            handleClick={this.handleClickRadio}
          />
          <RadioButton
            value='C'
            color='secondary'
            disabled={disabled}
            checked={selectedValue === 'C'}
            handleClick={this.handleClickRadio}
          />
        </div>
        <FileUpload />
        <SlideBar
          handleDelete={this.handleDelete}
          switchChangeHandler={this.switchChangeHandler}
          selectChangeHandler={this.selectChange}
          subjectChangeHandler={this.subjectChangeHandler}
          currencies={currencies}
          selectValue={selectedValue}
          subjectValue={subjectValue}
          switchSlideBar={switchSlideBar}
        />
        <div className='item'>
          <h3 className='item-title'>Multitabs</h3>
          <Multitabs
            currentTab={currentTab}
            onTabChange={this.handleTabChange}
            tabList={tabList}
          />
          <h3 className='item-title'>Search Bars</h3>
          <AddSearch />
          <AddSearchUpDown />
          <FiltSearchCat />
        </div>
        <div className='item'>
          <h3>Inline Bars</h3>
          <AddInline />
        </div>
        <div className='item'>
          <h3 className='item-title'>List</h3>
          <ClientTable fields={fields} data={data} />
        </div>
      </div>
    )
  }

  inputChangeHandler = (nameField, value) => {
    console.log(`${nameField}: ${value}`)
  };
  selectChangeHandler = (nameField, value) => {
    console.log(`${nameField}: ${value}`)
  };
  subjectChangeHandler = e => {
    const { value } = e.target
    console.log(value)
    this.setState({ subjectValue: value })
  };
  handleClick = () => {
    window.alert('successful')
  };
  handleClickCheckbox = (e, checked) => {
    console.log(e.target.value)
    this.setState({ checked })
  };
  handleClickRadio = (e, checked) => {
    console.log(e.target.value)
    this.setState({ selectedValue: e.target.value })
  };
  handleDelete = () => {
    window.alert('You clicked the delete icon.')
  };
  switchChangeHandler = e => {
    console.log('You clicked the switch')
    console.log('value', e.target.value)
    this.setState({ switchSlideBar: e.target.checked })
  };
  selectChange = e => {
    console.log('You clicked the select')
    this.setState({ selectValue: e.target.value })
  };
  handleTabChange = tabId => {
    this.setState({ currentTab: tabId })
  };
  selectChange = (e) => {
    console.log('You clicked the select')
    this.setState({ selectValue: e.target.value })
  }
  handleTabChange = (tabId) => {
    this.setState({ currentTab: tabId })
  }
}

export default Virtual
