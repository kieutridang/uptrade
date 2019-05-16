import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'

import Input from '../../../../components/Input'

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

class TextFields extends React.Component {
  render () {
    const { classes } = this.props

    return (
      <div className={`box-body ${classes.container}`}>
        <div className='container-fluid no-padding'>
          <div className='row'>
            <div className='col-sm-3'>
              <Field
                label='Color'
                name='color'
                className={classes.textField}
                component={Input}
              />
            </div>
            <div className='col-sm-3'>
              <Field
                label='Customer item #'
                name='customerItemNumber'
                className={classes.textField}
                component={Input}
              />
            </div>
            <div className='col-sm-3'>
              <Field
                label='Exclusivity'
                name='exclusivity'
                className={classes.textField}
                component={Input}
              />
            </div>
          </div>
          <div className='row longinputs'>
            <div className='col-sm-6'>
              <Field
                label='Short Description'
                name='shortDescription'
                className={classes.textField}
                multiline
                row='3'
                component={Input}
              />
              <Field
                label='Composition'
                name='composition'
                className={classes.textField}
                component={Input}
              />
              <Field
                label='Internal Remark'
                name='internalRemark'
                className={classes.textField}
                component={Input}
              />
            </div>
            <div className='col-sm-6 no-padding'>
              <Field
                label='Long Description'
                name='longDescription'
                className={classes.textField}
                multiline
                row='6'
                component={Input}
              />
              <Field
                label='Market Place Description'
                name='marketPlaceDescription'
                className={classes.textField}
                component={Input}
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

const TextFields3 = withStyles(styles)(TextFields)

const Descriptions = () => (
  <article className='article products closebox'>
    <div className='row'>
      <div className='col-sm-12'>
        <div className='box box-default'>
          <div className='box-header'>Descriptions</div>
          <div className='box-divider' />
          <TextFields3 />
        </div>
      </div>
    </div>
  </article>
)

export default Descriptions
