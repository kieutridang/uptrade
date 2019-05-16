import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'
import Typography from '@material-ui/core/Typography'

import Select from '../../../../components/Select'
import Input from '../../../../components/Input'
import InputTable from '../../../../components/InputTable'
import ToggleEditSaveInline from '../../../../components/InlineBars/ToggleEditSaveInline'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
import '../index.scss'
import SelectInput from '../../../../components/SelectInput'
import countryData from '../../../../assets/countryData'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
    fontSize: '0.875rem',
    lineHeight: '1rem'
  },

  menu: {
    width: 200
  }
})

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

class Logistic extends React.Component {
  render () {
    const {
      classes,
      viewMode,
      handleToggleActiveEdit,
      handleSubmit,
      dirty,
      isSubmitting,
      setFieldValue,
      values
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
      <form id='product-detail-logistics-form' onSubmit={handleSubmit}>
        <BlockNavigationComponent open={dirty && !isSubmitting} />
        <article className='article'>
          <div className='box box-default table-box mdl-shadow--2dp'>
            <div className='box-header'>
              Logistics
              <ToggleEditSaveInline
                title='Logistics'
                viewMode={viewMode}
                editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeLogisticsEdit')}
                saveDisabled={isSubmitting || !dirty}
              />
            </div>
            <div className='box-divider' />
            <div className={`box-body ${classes.container} pb-0`}>
              <div className='container-fluid no-padding'>
                <div className='row' style={{ marginBottom: '10px' }}>
                  <div className='col-sm-4 col-md-3'>
                    <Field
                      name='incoterm'
                      label='Incoterm'
                      className={classes.textField}
                      component={Input}
                      disabled={!activeEdit}
                    />
                  </div>
                  <div className='col-sm-4 col-md-3'>
                    <Field
                      name='origin'
                      label='Origin'
                      suggestions={countryData}
                      onChange={(value) => {
                        setFieldValue('origin', value)
                      }}
                      isDisabled={!activeEdit}
                      getOptionLabel={(option) => (option.flag + option.common)}
                      value={values.origin}
                      component={SelectInput}
                    />
                  </div>
                  <div className='col-sm-4 col-md-3'>
                    <Field
                      name='port'
                      label='Port'
                      className={classes.textField}
                      options={portOptions}
                      component={Select}
                      disabled={!activeEdit}
                    />
                  </div>
                  <div className='col-sm-4 col-md-3'>
                    <Field
                      name='hsCode'
                      label='HS Code'
                      margin='normal'
                      component={Input}
                      disabled={!activeEdit}
                    />
                  </div>
                </div>
              </div>
            </div>
            <table className='mdl-data-table' style={{ borderRight: '0px' }}>
              <thead>
                <tr>
                  <th className='mdl-data-table__cell--non-numeric'>Type</th>
                  <th>Units</th>
                  <th>L</th>
                  <th>W</th>
                  <th>H</th>
                  <th>Net weight</th>
                  <th>Gross weight</th>
                  <th>Vol.</th>
                  <th className='mdl-data-table__cell--non-numeric'>Barcode</th>
                  <th className='mdl-data-table__cell--non-numeric'>Pack</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='mdl-data-table__cell--non-numeric'>
                    <Typography className='text-dark' variant='caption'>Unit</Typography>
                  </td>
                  <td>
                    <Field
                      name='unit.units'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='unit.l'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='unit.w'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='unit.h'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='unit.netWeight'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='unit.grossWeight'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='unit.volume'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td className='mdl-data-table__cell--non-numeric'>
                    <Field
                      name='unit.barCode'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td className='mdl-data-table__cell--non-numeric'>
                    <Field
                      name='unit.pack'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                </tr>
                <tr>
                  <td className='mdl-data-table__cell--non-numeric'>
                    <Typography className='text-dark' variant='caption'>Packaged</Typography>
                  </td>
                  <td>
                    <Field
                      name='packaged.units'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='packaged.l'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='packaged.w'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='packaged.h'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='packaged.netWeight'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='packaged.grossWeight'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='packaged.volume'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td className='mdl-data-table__cell--non-numeric'>
                    <Field
                      name='packaged.barCode'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td className='mdl-data-table__cell--non-numeric'>
                    <Field
                      name='packaged.pack'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                </tr>
                <tr>
                  <td className='mdl-data-table__cell--non-numeric'>
                    <Typography className='text-dark' variant='caption'>Inner Carton</Typography>
                  </td>
                  <td>
                    <Field
                      name='innerCarton.units'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='innerCarton.l'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='innerCarton.w'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='innerCarton.h'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='innerCarton.netWeight'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='innerCarton.grossWeight'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='innerCarton.volume'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td className='mdl-data-table__cell--non-numeric'>
                    <Field
                      name='innerCarton.barCode'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td className='mdl-data-table__cell--non-numeric'>
                    <Field
                      name='innerCarton.pack'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                </tr>
                <tr>
                  <td className='mdl-data-table__cell--non-numeric'>
                    <Typography className='text-dark' variant='caption'>Export Carton</Typography>
                  </td>
                  <td>
                    <Field
                      name='exportCarton.units'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='exportCarton.l'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='exportCarton.w'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='exportCarton.h'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='exportCarton.netWeight'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='exportCarton.grossWeight'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td>
                    <Field
                      type='number'
                      name='exportCarton.volume'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td className='mdl-data-table__cell--non-numeric'>
                    <Field
                      name='exportCarton.barCode'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                  <td className='mdl-data-table__cell--non-numeric'>
                    <Field
                      name='exportCarton.pack'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    />
                  </td>
                </tr>
                <tr>
                  <td className='mdl-data-table__cell--non-numeric'>
                    <Typography className='text-dark' variant='caption'>Pallet</Typography>
                  </td>
                  <td>
                    {/* <Field
                      type='number'
                      name='exportCarton.units'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    /> */}
                  </td>
                  <td>
                    {/* <Field
                      type='number'
                      name='exportCarton.l'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    /> */}
                  </td>
                  <td>
                    {/* <Field
                      type='number'
                      name='exportCarton.w'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    /> */}
                  </td>
                  <td>
                    {/* <Field
                      type='number'
                      name='exportCarton.h'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    /> */}
                  </td>
                  <td>
                    {/* <Field
                      type='number'
                      name='exportCarton.netWeight'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    /> */}
                  </td>
                  <td>
                    {/* <Field
                      type='number'
                      name='exportCarton.grossWeight'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    /> */}
                  </td>
                  <td>
                    {/* <Field
                      type='number'
                      name='exportCarton.volume'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    /> */}
                  </td>
                  <td className='mdl-data-table__cell--non-numeric'>
                    {/* <Field
                      type='number'
                      name='exportCarton.barCode'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    /> */}
                  </td>
                  <td className='mdl-data-table__cell--non-numeric'>
                    {/* <Field
                      type='number'
                      name='exportCarton.pack'
                      className={classes.textField}
                      margin='normal'
                      component={InputTable}
                      disabled={!activeEdit}
                    /> */}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </form>
    )
  }
}

Logistic.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Logistic)
