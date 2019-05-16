import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'formik'
import { withStyles } from '@material-ui/core/styles'
import CheckboxGroup from '../../../../components/CheckBox/CheckboxGroup'
import CheckBox from '../../../../components/CheckBox/CheckboxItem'

const styles = theme => ({
  root: {
    display: 'flex'
  },
  formControl: {
    margin: theme.spacing.unit * 3
  }
})

const CheckboxesGroup = (props) => {
  const {
    values,
    touched,
    setFieldValue,
    setFieldTouched,
    isSubmitting
  } = props

  return (
    <div className='box box-default'>
      <div className='box-header'>
        Concurrents
      </div>
      <div className='box-divider' />
      <div className='box-body'>
        <div className='container'>
          <CheckboxGroup
            id='concurrentList'
            value={values.concurrentList}
            touched={touched.concurrentList}
            onChange={setFieldValue}
            onBlur={setFieldTouched}
            childClass='col-sm-2'
          >
            <Field
              component={CheckBox}
              name='concurrentList'
              id='Carrefour'
              label='Carrefour'
              value='Carrefour'
              disabled={isSubmitting}
            />
            <Field
              component={CheckBox}
              name='concurrentList'
              id='Auchan'
              label='Auchan'
              value='Auchan'
              disabled={isSubmitting}
            />
            <Field
              component={CheckBox}
              name='concurrentList'
              id='Gifi'
              label='Gifi'
              value='Gifi'
              disabled={isSubmitting}
            />
            <Field
              component={CheckBox}
              name='concurrentList'
              id='Leclerc'
              label='Leclerc'
              value='Leclerc'
              disabled={isSubmitting}
            />
            <Field
              component={CheckBox}
              name='concurrentList'
              id='Cora'
              label='Cora'
              value='Cora'
              disabled={isSubmitting}
            />
            <Field
              component={CheckBox}
              name='concurrentList'
              id='Lidl'
              label='Lidl'
              value='Lidl'
              disabled={isSubmitting}
            />
            <Field
              component={CheckBox}
              name='concurrentList'
              id='Edeka'
              label='Edeka'
              value='Edeka'
              disabled={isSubmitting}
            />
            <Field
              component={CheckBox}
              name='concurrentList'
              id='Kaufland'
              label='Kaufland'
              value='Kaufland'
              disabled={isSubmitting}
            />
          </CheckboxGroup>
        </div>
      </div>
    </div>
  )
}

CheckboxesGroup.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(CheckboxesGroup)
