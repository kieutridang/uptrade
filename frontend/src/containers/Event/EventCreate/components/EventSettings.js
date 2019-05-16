import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'

import Input from '../../../../components/Input'
import SelectInput from '../../../../components/SelectInput'
import SaveInline from '../../../../components/InlineBars/SaveInline'
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
  constructor (props) {
    super(props)
    this.CityPicker = React.createRef()
  }
  render () {
    const {
      classes,
      handleSubmit,
      dirty,
      isSubmitting,
      setFieldValue,
      values,
      getCityList,
      errors
    } = this.props

    let cityList = getCityList.loading ? [] : getCityList.country.cityList
    cityList = cityList.map(city => ({ label: city, value: city }))

    const country = countryData.find(country => (country === values.country))
    const cca2 = country ? country.cca2 : ''

    return (
      <form onSubmit={handleSubmit} id='create-event-form'>
        <BlockNavigationComponent open={dirty && !isSubmitting} />
        <div className='box box-default'>
          <div className='box-header'>Event Settings
            <SaveInline
              type='submit'
              disabled={isSubmitting || !dirty}
              title='Save Settings'
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
                      type='date'
                    />
                  </div>
                  <div className='col-sm-3'>
                    <Field
                      name='country'
                      label='Event Country'
                      placeholder='Select event country ...'
                      suggestions={countryData}
                      onChange={(value) => {
                        setFieldValue('country', value)
                        this.CityPicker.current.value = ''
                        setFieldValue('city', '')
                      }}
                      isDisabled={isSubmitting}
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
                      isDisabled={isSubmitting}
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
                <span className='error-message'>{ errors['form'] }</span>
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
