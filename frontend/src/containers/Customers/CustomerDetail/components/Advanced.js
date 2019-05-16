import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'
import Select from '../../../../components/Select'
import Input from '../../../../components/Input'
// import ToggleEditSaveInline from '../../../../components/InlineBars/ToggleEditSaveInline'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
import { yearsOptions, yesNoOptions, typesOptions, ownershipOptions, marketsOptions } from '../../../DummyData'

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
          <div className='box-header'>Advanced
            {/* <ToggleEditSaveInline
              title='Advanced'
              viewMode={viewMode}
              editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeAdvancedEdit')}
              saveDisabled={isSubmitting || !dirty}
            /> */}
          </div>
          <div className='box-divider' />
          <div className='box-body'>
            <div className='container'>
              <div className='row titlerow' />
              <div className='row'>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='ownBrand'
                    label='Own Brand(s)'
                    className={classes.textField}
                    margin='normal'
                    options={yesNoOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-8 col-md-9 col-lg-10'>
                  <label style={{ color: 'rgba(0, 0, 0, 0.54)', padding: '0', fontSize: '13px', fontFamily: 'Roboto', lineHeight: '1' }}>Brands</label>
                  {/* <Brands /> */}
                </div>

              </div>
              <div className='row'>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='license'
                    label='License(s)'
                    className={classes.textField}
                    margin='normal'
                    options={yesNoOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-8 col-md-9 col-lg-10'>
                  <label style={{ color: 'rgba(0, 0, 0, 0.54)', padding: '0', fontSize: '13px', fontFamily: 'Roboto', lineHeight: '1' }}>Licenses</label>
                  {/* <Licenses /> */}
                </div>
              </div>

              <div className='row'>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='yearEstablished'
                    label='Year Established'
                    className={classes.textField}
                    margin='normal'
                    options={yearsOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='oemCapacity'
                    label='OEM Capacity'
                    className={classes.textField}
                    margin='normal'
                    options={yesNoOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='type'
                    label='Type'
                    className={classes.textField}
                    margin='normal'
                    options={typesOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='exportLicense'
                    label='Export License'
                    className={classes.textField}
                    margin='normal'
                    options={yesNoOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='domesticLicense'
                    label='Domestic License'
                    className={classes.textField}
                    margin='normal'
                    options={yesNoOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='listedCompany'
                    label='Listed Company'
                    className={classes.textField}
                    margin='normal'
                    options={yesNoOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='ownership'
                    label='Ownership'
                    className={classes.textField}
                    margin='normal'
                    options={ownershipOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <label style={{ color: 'rgba(0, 0, 0, 0.54)', padding: '0', fontSize: '13px', fontFamily: 'Roboto', lineHeight: '1' }}>Business Registation</label>
                </div>
              </div>
              <div className='row'>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='customer_1'
                    label='Customer #1'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='customer_2'
                    label='Customer #2'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='customer_3'
                    label='Customer #3'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='customer_4'
                    label='Customer #4'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='customer_5'
                    label='Customer #5'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='market_1'
                    label='Market #1'
                    className={classes.textField}
                    margin='normal'
                    options={marketsOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='market_2'
                    label='Market #2'
                    className={classes.textField}
                    margin='normal'
                    options={marketsOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='market_3'
                    label='Market #3'
                    className={classes.textField}
                    margin='normal'
                    options={marketsOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='market_4'
                    label='Market #4'
                    className={classes.textField}
                    margin='normal'
                    options={marketsOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='market_5'
                    label='Market #5'
                    className={classes.textField}
                    margin='normal'
                    options={marketsOptions}
                    component={Select}
                    disabled={!activeEdit}
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='sale_y_1'
                    label='Sales 2017'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='sale_y_2'
                    label='Sales 2016'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='sale_y_3'
                    label='Sales 2015'
                    className={classes.textField}
                    margin='normal'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-sm-4 col-md-3 col-lg-2'>
                  <Field
                    name='exportPercentage'
                    label='% Export'
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
