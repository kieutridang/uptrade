import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'

import Button from '../../../../components/Button'
import Input from '../../../../components/Input'
import SelectInput from '../../../../components/SelectInput'
import ToggleEditSaveInline from '../../../../components/InlineBars/ToggleEditSaveInline'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
import countryData from '../../../../assets/countryData'

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
  greenButton: {
    color: 'white',
    background: '#00B9AE',
    minHeight: '31px',
    float: 'right',
    fontSize: '80%',
    marginTop: '-5px'
  }
})

class EventSettings extends React.Component {
  clickLinkProductListHandler = () => {
    const eventId = this.props.match.params.id
    this.props.history.push(`/events/${eventId}/products`)
  }
  render () {
    const {
      classes,
      viewMode,
      handleToggleActiveEdit,
      handleSubmit,
      setFieldValue,
      dirty,
      isSubmitting,
      values,
      getCityList
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

    let cityList = getCityList.loading ? [] : getCityList.country.cityList
    cityList = cityList.map(city => ({ label: city, value: city }))

    const country = countryData.find(country => (country === values.country))
    const cca2 = country ? country.cca2 : ''

    return (
      <form onSubmit={handleSubmit} id='edit-event-settings-form'>
        <BlockNavigationComponent open={dirty && !isSubmitting} />
        <div className='box box-default'>
          <div className='box-header'>Event Settings
            <Button id='event-product-list-button' className={`btn-w-sm ${classes.greenButton}`} handleClick={this.clickLinkProductListHandler}>PRODUCT LIST</Button>
            <ToggleEditSaveInline
              title='Event Settings'
              viewMode={viewMode}
              editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeEventSettingsEdit')}
              saveDisabled={isSubmitting || !dirty}
            />
          </div>
          <div className='box-divider' />
          <div className='box-body'>
            <div className={classes.container}>
              <div className='container-fluid no-padding'>
                <div className='row'>
                  <div className='col-sm-6'>
                    <Field
                      name='name'
                      label='Event Name'
                      className={classes.textField}
                      margin='normal'
                      component={Input}
                      disabled={!activeEdit}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-sm-3'>
                    <Field
                      name='startDate'
                      label='Start Date'
                      className={classes.textField}
                      margin='normal'
                      component={Input}
                      disabled={!activeEdit}
                      type='date'
                    />
                  </div>
                  <div className='col-sm-3'>
                    <Field
                      name='endDate'
                      label='End Date'
                      className={classes.textField}
                      margin='normal'
                      component={Input}
                      disabled={!activeEdit}
                      type='date'
                    />
                  </div>
                  <div className='col-sm-3'>
                    <Field
                      name='country'
                      label='Event Country'
                      placeholder='Select event country ...'
                      margin='normal'
                      suggestions={countryData}
                      onChange={(value) => {
                        setFieldValue('country', value)
                        this.CityPicker.current.value = ''
                        setFieldValue('city', '')
                      }}
                      isDisabled={!activeEdit}
                      getOptionLabel={(option) => (option.flag + option.common)}
                      value={values.country}
                      component={SelectInput}
                    />
                  </div>
                  <div className='col-sm-3'>
                    <Field
                      name='city'
                      label='Event City'
                      placeholder='Select event city ...'
                      suggestions={cityList}
                      onChange={(value) => setFieldValue('city', value)}
                      isLoading={getCityList.loading}
                      isDisabled={!activeEdit}
                      handleInputChange={(value) => {
                        if (value.length === 2) {
                          getCityList.refetch({ name: cca2, filter: value })
                        }
                        if (value.length <= 1) {
                          getCityList.refetch({ name: '', filter: '' })
                        }
                      }}
                      minSearchLength={2}
                      value={values.city}
                      innerRef={this.CityPicker}
                      component={SelectInput}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

EventSettings.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EventSettings)
