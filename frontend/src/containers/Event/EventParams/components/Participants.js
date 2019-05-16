import React from 'react'
import { Field, FieldArray } from 'formik'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import MailICon from '@material-ui/icons/Mail'
import Avatar from '@material-ui/core/Avatar'
import ImageIcon from '@material-ui/icons/Image'
import DeleteIcon from '@material-ui/icons/Delete'

import AddSearchInline from '../../../../components/SearchBars/AddSearchInline'
import Input from '../../../../components/Input'
import SingleCheckboxButton from '../../../../components/CheckBox/SingleCheckbox'
import ToggleEditSaveAddInline from '../../../../components/InlineBars/ToggleEditSaveAddInline'
import Modal from '../../../../components/Modal'
import AddUserForm from './AddUserForm'
import AddCompanyForm from './AddCompanyForm'
import Helper from '../../../../Helper'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
const styles = theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    margin: 'auto 0'
  }
})

class Participants extends React.Component {
  constructor () {
    super()
    this.state = {
      expanded: null,
      isOpenModel: false,
      helperArrayMethod: undefined,
      userOfParticipants: [],
      usersOfCompany: [],
      isAddingCompany: false
    }
  }
  handleChange = (panel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    })
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
  handleOpenModel = (helper, participant) => {
    let userIdOfParticipant = []
    participant._users && participant._users.forEach(element => {
      userIdOfParticipant.push(element._id)
    })

    const { getCompanyCustomers, getCompanySuppliers } = this.props
    const companyCustomerArray = getCompanyCustomers.companyCustomers.customers
    const companySupplierArray = getCompanySuppliers.companySuppliers.suppliers
    const isSupplier = companySupplierArray.find((company) => (company.companyId === participant.companyId))
    const isCustomer = companyCustomerArray.find((company) => (company.companyId === participant.companyId))
    const instance = isSupplier || isCustomer
    let usersOfCompany = []

    if (participant.company) {
      usersOfCompany = participant.company._users
      usersOfCompany = usersOfCompany.concat(participant.company._admins)
    } else {
      usersOfCompany = instance._company._users
      usersOfCompany = usersOfCompany.concat(instance._company._admins)
    }
    this.setState({
      usersOfCompany,
      isOpenModel: true,
      helperArrayMethod: helper,
      userOfParticipants: userIdOfParticipant
    })
  }
  handleCloseModal = () => {
    this.setState({ isOpenModel: false })
  }
  handleToggleAddCompany = () => {
    const { isAddingCompany } = this.state
    this.setState({ isAddingCompany: !isAddingCompany })
  }
  render () {
    const { expanded, isOpenModel, usersOfCompany, isAddingCompany } = this.state
    const {
      classes,
      viewMode,
      handleToggleActiveEdit,
      handleSubmit,
      dirty,
      isSubmitting,
      values,
      getCompanyCustomers,
      getCompanySuppliers,
      handleSendEventInvationEmail
    } = this.props
    let activeEdit
    switch (viewMode) {
      case 'show':
        activeEdit = false
        break
      case 'edit':
        activeEdit = true
        break
      default: return null
    }
    return (
      <div>
        <form onSubmit={handleSubmit} id='edit-event-participants-form'>
          <BlockNavigationComponent open={dirty && !isSubmitting} />
          <div className='box box-default'>
            <div className='box-header'>Participants
              <ToggleEditSaveAddInline
                title='Participants'
                viewMode={viewMode}
                editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeParticipantsEdit')}
                addClickHandler={this.handleToggleAddCompany}
                saveDisabled={isSubmitting || !dirty}
              />
            </div>
            <div className='box-divider' />
            <div className='box-body'>
              <FieldArray
                name='participants'
                render={arrayHelpers => (
                  <div className={classes.root}>
                    <Modal
                      isOpen={isAddingCompany}
                      handleClose={this.handleToggleAddCompany}
                    >
                      <AddCompanyForm
                        helperArray={arrayHelpers}
                        addedCompanies={values.participants}
                        getCompanyCustomers={getCompanyCustomers}
                        getCompanySuppliers={getCompanySuppliers}
                        handleModalClose={this.handleToggleAddCompany}
                        activeEdit={activeEdit}
                        handleToggleActiveEdit={handleToggleActiveEdit}
                      />
                    </Modal>
                    {values.participants && values.participants.map((item, index) => {
                      const { name, logo, description } = this.getParticipantInfo(item.companyId, index)
                      return (
                        <ExpansionPanel id={`participant-item-container_${index}`} key={index} expanded={expanded === `panel_${index}`} onChange={this.handleChange(`panel_${index}`)}>
                          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon className='toogle-expaned-button' />}>
                            <Typography className={classes.heading}>
                              <img className='companyAvatar' src={Helper.generateImageURL(logo || '')} alt='customer logo' /><b>{index === 0 ? 'My team' : (name || '')}</b>
                            </Typography>
                            <Typography className={classes.secondaryHeading}>{description || ''}</Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            <div className='container fullWidth accordiondetail'>
                              <div className='row'>
                                <div className='col-sm-4 col-md-3 checklabel'>
                                  <Field
                                    name={`participants[${index}]shareFactoryPrice`}
                                    label='Share Factory Price'
                                    className={classes.textField}
                                    margin='normal'
                                    component={SingleCheckboxButton}
                                    disabled={!activeEdit}
                                  />
                                </div>
                                <div className='col-sm-4 col-md-3 checklabel'>
                                  <Field
                                    name={`participants[${index}]shareSupplierDetails`}
                                    label='Share Supplier Details'
                                    className={classes.textField}
                                    margin='normal'
                                    component={SingleCheckboxButton}
                                    disabled={!activeEdit}
                                  />
                                </div>
                                <div className='col-sm-4 col-md-3 checklabel'>
                                  <Field
                                    name={`participants[${index}]allowToAddUsers`}
                                    label='Allow To Add Users'
                                    className={classes.textField}
                                    margin='normal'
                                    component={SingleCheckboxButton}
                                    disabled={!activeEdit}
                                  />
                                </div>
                                <div className='col-sm-4 col-md-3 checklabel'>
                                  <Field
                                    name={`participants[${index}]allowToSeeOtherCompanies`}
                                    label='Allow To See Other Companies'
                                    className={classes.textField}
                                    margin='normal'
                                    component={SingleCheckboxButton}
                                    disabled={!activeEdit}
                                  />
                                </div>
                                <div className='col-sm-4 col-md-3 col-lg-2 defaultMarginField'>
                                  <Field
                                    name={`participants[${index}]defaultMargin`}
                                    label='Default Margin On Factory Price'
                                    component={Input}
                                    disabled={!activeEdit}
                                    type='number'
                                  />
                                </div>
                              </div>
                              <div className='row accordiondetail'>
                                <FieldArray
                                  name={`participants[${index}]_users`}
                                  render={arrayHelpers => (
                                    <div className='container'><br />
                                      <AddSearchInline clickAddHandler={() => this.handleOpenModel(arrayHelpers, item)} disabledAddButton={!activeEdit} />
                                      {item._users && item._users.map((user, indexUser) => {
                                        return (
                                          <List key={`${indexUser}_${user._id}`}>
                                            <ListItem
                                              role={undefined}
                                              button
                                              className={classes.listItem}
                                            >
                                              <Avatar style={{ margin: '0 20px' }}>
                                                {user.avatar ? <img className='user-avatar' src={user.avatar} alt='user avatar' /> : <ImageIcon />}
                                              </Avatar>
                                              <ListItemText primary={`${user.firstName}`} secondary={user.position && user.position} />
                                              <ListItemSecondaryAction>
                                                <IconButton aria-label='Send Invite"' onClick={() => handleSendEventInvationEmail(user)}>
                                                  <MailICon />
                                                </IconButton>
                                                <IconButton aria-label='Delete' onClick={() => arrayHelpers.remove(indexUser)} disabled={!activeEdit}>
                                                  <DeleteIcon />
                                                </IconButton>
                                              </ListItemSecondaryAction>
                                            </ListItem>
                                          </List>
                                        )
                                      })}
                                    </div>
                                  )}
                                />
                              </div>
                            </div>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      )
                    })}
                  </div>
                )}
              />
            </div>
          </div>
          <Modal isOpen={isOpenModel} handleClose={this.handleCloseModal}>
            <AddUserForm userOfParticipants={this.state.userOfParticipants} usersOfCompany={usersOfCompany} helperArray={this.state.helperArrayMethod} handleModalClose={this.handleCloseModal} />
          </Modal>
        </form>
      </div>
    )
  }
}

export default withStyles(styles)(Participants)
