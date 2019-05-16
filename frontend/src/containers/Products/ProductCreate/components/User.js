import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'

import AddInline from '../../../../components/InlineBars/AddInline'
import Select from '../../../../components/Select'

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

const users = [
  {
    value: 'Lisa Doherty',
    text: 'Lisa Doherty'
  },
  {
    value: 'John Ray',
    text: 'John Ray'
  },
  {
    value: 'Steve Connelly',
    text: 'Steve Connelly'
  },
  {
    value: 'Joe Black',
    text: 'Joe Black'
  }
]

class TextFields extends React.Component {
  render () {
    const { classes } = this.props

    return (
      <div className='row'>
        <div className='col-sm-3'>
          <Field
            label='Product Manager'
            name='productManager'
            className={classes.textField}
            options={users}
            component={Select}
          />
        </div>
        <div className='col-sm-3'>
          <Field
            label='Procurement Manager'
            name='procurementManager'
            className={classes.textField}
            options={users}
            component={Select}
          />
        </div>
        <div className='col-sm-3'>
          <Field
            label='Quality Manager'
            name='qualityManager'
            className={classes.textField}
            options={users}
            component={Select}
          />
        </div>
        <div className='col-sm-3'>
          <Field
            label='Marketing Manager'
            name='marketingmanager'
            className={classes.textField}
            options={users}
            component={Select}
          />
        </div>
      </div>
    )
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired
}

const TextFields4 = withStyles(styles)(TextFields)

const Cost = () => (
  <article className='article'>
    <div className='row'>
      <div className='col-sm-12'>
        <div className='box box-default table-box mdl-shadow--2dp'>
          <div className='box-header'>
            Users
            <AddInline />
          </div>
          <div className='box-divider' />
          <div className='container'>
            <TextFields4 />
          </div>
          <br />
        </div>
      </div>
    </div>
  </article>
)

export default Cost
