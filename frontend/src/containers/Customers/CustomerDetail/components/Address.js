import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'
import Select from '../../../../components/Select'
import Input from '../../../../components/Input'
// import ToggleEditSaveInline from '../../../../components/InlineBars/ToggleEditSaveInline'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
import { countriesOptions, portsOptions } from '../../../DummyData'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: '0.5rem',
    width: '100%',
    fontSize: '0.875rem',
    lineHeight: '1rem'
  },

  menu: {
    width: 200
  }
})

class Address extends React.Component {
  render () {
    const {
      classes,
      viewMode,
      // handleToggleActiveEdit,
      handleSubmit,
      dirty,
      isSubmitting
    } = this.props
    let activeEdit
    switch (viewMode) {
      case 'show':
        activeEdit = false
        break
      case 'edit':
        activeEdit = true
        break
      default:
        activeEdit = false
        break
    }
    return (
      <form onSubmit={handleSubmit}>
        <BlockNavigationComponent open={dirty && !isSubmitting} />
        <div className='box box-default'>
          <div className='box-header'>Address
            {/* <ToggleEditSaveInline
              title='Address'
              viewMode={viewMode}
              editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeAddressEdit')}
              saveDisabled={isSubmitting || !dirty}
            /> */}
          </div>
          <div className='box-divider' />
          <div className='box-body'>
            <div className='container'>
              <div className='row titlerow' />
              <div className='row'>
                <div className='col-sm-4'>
                  <Field
                    name='country'
                    label='Country'
                    className={classes.textField}
                    margin='normal'
                    options={countriesOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4'>
                  <Field
                    name='defaultExportPort'
                    label='Export Port'
                    className={classes.textField}
                    margin='normal'
                    options={portsOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
              </div>
              <div className='box-divider inline' />
              <div className='row titlerow'><h5 className='inboxtitle'>English Address</h5></div>
              <div className='row'>
                <div className='col-sm-4'>
                  <Field
                    name='englishRoom'
                    label='Room / Building'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                  <Field
                    name='englishStreet'
                    label='Street'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4'>
                  <Field
                    name='englishDistrict'
                    label='District'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                  <Field
                    name='englishPostCode'
                    label='Postcode'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4'>
                  <Field
                    name='englishCity'
                    label='City'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                  <Field
                    name='englishProvince'
                    label='Province'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
              </div>
              <div className='box-divider inline' />
              <div className='row titlerow'><h5 className='inboxtitle'>Local Address</h5></div>
              <div className='row'>
                <div className='col-sm-4'>
                  <Field
                    name='localRoom'
                    label='Room / Building'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                  <Field
                    name='localStreet'
                    label='Street'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4'>
                  <Field
                    name='localDistrict'
                    label='District'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                  <Field
                    name='localPostCode'
                    label='Postcode'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4'>
                  <Field
                    name='localCity'
                    label='City'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                  <Field
                    name='localProvince'
                    label='Province'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
              </div>
              <div className='box-divider inline' />
              <div className='row titlerow'><h5 className='inboxtitle'>Contact</h5></div>
              <div className='row'>
                <div className='col-sm-4'>
                  <Field
                    name='website'
                    label='website'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4'>
                  <Field
                    name='email'
                    label='Email'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4'>
                  <Field
                    name='phone'
                    label='Phone'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

Address.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Address)
