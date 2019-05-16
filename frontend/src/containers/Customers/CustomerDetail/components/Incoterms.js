import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'

// import ToggleEditSaveInline from '../../../../components/InlineBars/ToggleEditSaveInline'
import CheckboxGroup from '../../../../components/CheckBox/CheckboxGroup'
import Checkbox from '../../../../components/CheckBox/CheckboxItem'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  menu: {
    width: 200
  }
})

class Incoterms extends React.Component {
  render () {
    const {
      touched,
      viewMode,
      // handleToggleActiveEdit,
      handleSubmit,
      dirty,
      isSubmitting,
      values,
      errors,
      setFieldValue,
      setFieldTouched
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
          <div className='box-header'>Incoterms
            {/* <ToggleEditSaveInline
              title='Incomterms'
              viewMode={viewMode}
              editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeIncotermsEdit')}
              saveDisabled={isSubmitting || !dirty}
            /> */}
          </div>
          <div className='box-divider' />
          <div className='box-body'>
            <div className='container'>
              <CheckboxGroup
                id='incoterms'
                value={values.incoterms}
                error={errors.incoterms}
                touched={touched.incoterms}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                childClass='col-sm-2'
              >
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='EXW'
                  label='EXW'
                  disabled={!activeEdit}
                />
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='FCA'
                  label='FCA'
                  disabled={!activeEdit}
                />
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='FAS'
                  label='FAS'
                  disabled={!activeEdit}
                />
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='FOB'
                  label='FOB'
                  disabled={!activeEdit}
                />
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='CFR'
                  label='CFR'
                  disabled={!activeEdit}
                />
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='CIF'
                  label='CIF'
                  disabled={!activeEdit}
                />
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='CPT'
                  label='CPT'
                  disabled={!activeEdit}
                />
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='DDP'
                  label='DDP'
                  disabled={!activeEdit}
                />
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='DDU'
                  label='DDU'
                  disabled={!activeEdit}
                />
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='DAF'
                  label='DAF'
                  disabled={!activeEdit}
                />
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='DES'
                  label='DES'
                  disabled={!activeEdit}
                />
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='DEQ'
                  label='DEQ'
                  disabled={!activeEdit}
                />
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='CIP'
                  label='CIP'
                  disabled={!activeEdit}
                />
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='DAT'
                  label='DAT'
                  disabled={!activeEdit}
                />
                <Field
                  component={Checkbox}
                  name='incoterms'
                  id='DAP'
                  label='DAP'
                  disabled={!activeEdit}
                />
              </CheckboxGroup>
            </div>
          </div>
        </div>
        <span className='error-message'>{ errors['form'] }</span>
      </form>
    )
  }
}

Incoterms.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Incoterms)
