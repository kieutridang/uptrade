import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'

import Input from '../../../../components/Input'
import ToggleEditSaveInline from '../../../../components/InlineBars/ToggleEditSaveInline'
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

class Descriptions extends React.Component {
  render () {
    const {
      classes,
      viewMode,
      handleToggleActiveEdit,
      handleSubmit,
      dirty,
      isSubmitting,
      errors
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
      <form id='product-detail-descriptions-form' onSubmit={handleSubmit}>
        <BlockNavigationComponent open={dirty && !isSubmitting} />
        <article className='article products closebox'>
          <div className='container-fluid no-padding'>
            <div className='row'>
              <div className='col-sm-12'>
                <div className='box box-default'>
                  <div className='box-header'>Descriptions
                    <ToggleEditSaveInline
                      title='Descriptions'
                      viewMode={viewMode}
                      editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeDescriptionEdit')}
                      saveDisabled={isSubmitting || !dirty}
                    />
                  </div>
                  <div className='box-divider' />
                  <div className={`box-body ${classes.container}`}>
                    <div className='container-fluid no-padding'>
                      <div className='row'>
                        <div className='col-sm-3'>
                          <Field
                            name='color'
                            label='Color'
                            className={classes.textField}
                            margin='normal'
                            component={Input}
                            disabled={!activeEdit}
                          />
                        </div>
                        <div className='col-sm-3'>
                          <Field
                            name='customerItemNumber'
                            label='Customer item #'
                            className={classes.textField}
                            margin='normal'
                            component={Input}
                            disabled={!activeEdit}
                          />
                        </div>
                        <div className='col-sm-3'>
                          <Field
                            name='exclusivity'
                            label='Exclusivity'
                            className={classes.textField}
                            margin='normal'
                            component={Input}
                            disabled={!activeEdit}
                          />
                        </div>
                      </div>
                      <div className='row longinputs'>
                        <div className='col-sm-6'>
                          <Field
                            name='shortDescription'
                            label='Short Description'
                            className={classes.textField + '98width'}
                            margin='normal'
                            multiline
                            row='3'
                            component={Input}
                            disabled={!activeEdit}
                          />
                          <Field
                            name='composition'
                            label='Composition'
                            multiline
                            row='3'
                            className={classes.textField + '98width'}
                            margin='normal'
                            component={Input}
                            disabled={!activeEdit}
                          />
                          <Field
                            name='internalRemark'
                            label='Internal Remark'
                            className={classes.textField + '98width'}
                            margin='normal'
                            multiline
                            row='3'
                            component={Input}
                            disabled={!activeEdit}
                          />
                        </div>
                        <div className='col-sm-6 no-padding'>
                          <Field
                            name='longDescription'
                            label='Long Description'
                            className={classes.textField + '98width'}
                            margin='normal'
                            multiline
                            row='6'
                            component={Input}
                            disabled={!activeEdit}
                          />
                          <Field
                            name='marketPlaceDescription'
                            label='Market Place Description'
                            className={classes.textField + '98width'}
                            margin='normal'
                            multiline
                            row='6'
                            component={Input}
                            disabled={!activeEdit}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
        <span className='error-message'>{ errors['form'] }</span>
      </form>
    )
  }
}

Descriptions.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Descriptions)
