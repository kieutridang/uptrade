import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'

import Input from '../../../../components/Input'
import Select from '../../../../components/Select'
import SelectInput from '../../../../components/SelectInput'
import country from '../../../../assets/countryData'

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

const testCertificateOptions = [
  {
    value: 'Yes',
    text: 'Yes'
  },
  {
    value: 'No',
    text: 'No'
  }
]

const currencyOptions = [
  {
    value: 'USD',
    text: 'USD'
  },
  {
    value: 'RMB',
    text: 'RMB'
  },
  {
    value: 'RUB',
    text: 'RUB'
  },
  {
    value: 'VND',
    text: 'VND'
  },
  {
    value: 'EUR',
    text: 'EUR'
  },
  {
    text: 'MRD',
    value: 'MRD'
  },
  {
    text: 'HKD',
    value: 'HKD'
  }
]

const portOptions = [
  {
    text: 'Shang Hai, China',
    value: 'SHANGHAI'
  },
  {
    text: 'Singapore',
    value: 'SINGAPORE'
  },
  {
    text: 'Shenzen, China',
    value: 'SHENZEN'
  },
  {
    text: 'Hong Kong, S.A.R., China',
    value: 'HONGKONG'
  },
  {
    text: 'Busan, South Korea',
    value: 'BUSAN'
  },
  {
    text: 'Ningbo-Zhousan, China',
    value: 'NINGBOZHOUSAN'
  },
  {
    text: 'Qindao, China',
    value: 'QINDAO'
  },
  {
    text: 'Guangzhou Harbor, China',
    value: 'GUANGZHOU'
  },
  {
    text: 'Jebel Ali, Dubai, United Arab Emirates',
    value: 'JEBELALI'
  },
  {
    text: 'Tianjin, China',
    value: 'TIANJIN'
  }
]
// const incotermOptions = [
//   {
//     value: 'FOB',
//     text: 'FOB'
//   },
//   {
//     value: 'EXW',
//     text: 'EXW'
//   }
// ]
class TextFields extends React.Component {
  state = {
    itemunit: 'PC',
    packaging: 'Gift Box',
    country: 'China',
    port: 'Yantian',
    carton: '12',
    cbm: '0.005'
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  };

  render () {
    const { classes, suppliers, activeEdit, setFieldValue, values } = this.props
    const suppliersOptions = suppliers && suppliers.map((supplier) => {
      return {
        value: supplier && supplier._id,
        text: supplier && supplier._company && supplier._company.about && supplier._company.about.name
      }
    })
    return (
      <div className={classes.container}>
        <div className='container-fluid no-padding'>
          <div className='row'>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                name='supplier[0]._id'
                label='Supplier'
                className={classes.textField}
                margin='normal'
                options={suppliersOptions || []}
                component={Select}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                name='cost.productsCost[0].currency'
                label='Supplier Currency'
                className={classes.textField}
                margin='text'
                options={currencyOptions}
                component={Select}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                type='number'
                name='cost.productsCost[0].cost'
                label='Fatory Price'
                className={classes.textField}
                margin='text'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                name='cost.marketPlacePrice.currency'
                label='Selling Currency'
                className={classes.textField}
                margin='text'
                options={currencyOptions}
                component={Select}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                type='number'
                name='cost.marketPlacePrice.cost'
                label='Selling Price'
                className={classes.textField}
                margin='text'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                name='logistics.unit.units'
                label='Unit'
                className={classes.textField}
                margin='text'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                name='essentials.MOQ'
                label='MOQ'
                className={classes.textField}
                margin='text'
                type='number'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                name='logistics.incoterm'
                label='Incoterm'
                className={classes.textField}
                margin='text'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                name='logistics.port'
                label='Port'
                className={classes.textField}
                margin='normal'
                options={portOptions}
                component={Select}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-3'>
              <Field
                name='origin'
                label='Origin'
                suggestions={country}
                onChange={(value) => {
                  setFieldValue('logistics.origin', value)
                }}
                isDisabled={!activeEdit}
                getOptionLabel={(option) => (option.flag + option.common)}
                value={(values && values.logistics && values.logistics.origin) || ''}
                component={SelectInput}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-3'>
              <div className='row'>
                <div className='col-4'>
                  <Field
                    name='logistics.unit.w'
                    label='Size cm'
                    className={classes.textField}
                    margin='normal'
                    type='number'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-4'>
                  <Field
                    label=' '
                    name='logistics.unit.h'
                    className={classes.textField}
                    margin='number'
                    type='number'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-4'>
                  <Field
                    label=' '
                    name='logistics.unit.l'
                    className={classes.textField}
                    margin='number'
                    type='number'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
              </div>
            </div>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                name='logistics.exportCarton.units'
                label='Carton Pack'
                className={classes.textField}
                margin='text'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                name='logistics.exportCarton.volume'
                label='CBM'
                className={classes.textField}
                margin='number'
                type='number'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                name='essentials.leadTime'
                label='Leadtime'
                className={classes.textField}
                margin='text'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                name='essentials.sampleCost'
                label='Sample Cost'
                type='number'
                step='0.01'
                className={classes.textField}
                margin='normal'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                name='essentials.sampleLeadTime'
                label='Sample Leadtime'
                className={classes.textField}
                margin='normal'
                component={Input}
                disabled={!activeEdit}
              />
            </div>
            <div className='col-sm-4 col-md-3 col-lg-2'>
              <Field
                name='essentials.testCertificate'
                label='Test / Certificate'
                className={classes.textField}
                margin='normal'
                options={testCertificateOptions}
                component={Select}
                disabled={!activeEdit}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired
}

const TextFields1 = withStyles(styles)(TextFields)

const Essentials = (props) => (
  <article className='article products closebox' style={{ marginTop: '-20px' }}>
    <div className='row article-notitle'>
      <div className='col-sm-12'>
        <div className='box box-default'>
          <div className='box-body'>
            <TextFields1 {...props} />
          </div>
        </div>
      </div>
    </div>
  </article>
)

export default Essentials
