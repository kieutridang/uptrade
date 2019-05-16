import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'
import Input from '../../../../components/Input'
import Select from '../../../../components/Select'
import CustomizeRadioButton from '../../../../components/RadioButton/CustomizeRadioButton'
// import ToggleEditSaveInline from '../../../../components/InlineBars/ToggleEditSaveInline'
import UploadFile from '../../../../components/FileUpload'
import APPCONFIG from '../../../../config/AppConfig'
import Helper from '../../../../Helper'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
import { uptradeAccountOptions } from '../../../DummyData'

// import UTcategories from './UTcategories'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    width: '100%',
    fontSize: '13px',
    marginLeft: '0px',
    marginRight: '0px'
  }
})

class About extends React.Component {
  render () {
    const {
      classes,
      viewMode,
      // handleToggleActiveEdit,
      handleSubmit,
      dirty,
      isSubmitting,
      values,
      setFieldValue
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
          <div className='box-header'>About
            {/* <ToggleEditSaveInline
              title='About'
              viewMode={viewMode}
              editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeAboutEdit')}
              saveDisabled={isSubmitting || !dirty}
            /> */}
          </div>
          <div className='box-divider' />
          <div className='box-body'>
            <div className='container'>
              <div className='row'>
                <div className='col-sm-6'>
                  <div className='row'>
                    <div className='col-sm-6'>
                      <Field
                        name='uptradeAccount'
                        label='UpTrade Account'
                        className={classes.textField}
                        margin='normal'
                        options={uptradeAccountOptions}
                        component={Select}
                        disabled={!activeEdit}
                      />
                    </div>
                    <div className='col-sm-6 text-center' style={{ paddingLeft: '20px', paddingTop: '16px', visibility: 'hidden' }}>
                      <Field
                        name='visibleUptradeNetwork'
                        label='Visible on UpTrade Network'
                        className={classes.textField}
                        margin='normal'
                        component={CustomizeRadioButton}
                        disabled={!activeEdit}
                      />
                    </div>
                    <div className='col-sm-4'>
                      <Field
                        name='uptradeID'
                        label='Uptrade ID'
                        className={classes.textField}
                        margin='normal'
                        component={Input}
                        disabled={!activeEdit}
                      />
                    </div>
                    <div className='col-sm-8'>
                      <Field
                        name='name'
                        label='Name'
                        className={classes.textField}
                        margin='normal'
                        component={Input}
                        disabled={!activeEdit}
                      />
                    </div>
                    <div className='col-12'>
                      <Field
                        name='fullName'
                        label='Full Name'
                        className={classes.textField}
                        margin='normal'
                        component={Input}
                        disabled={!activeEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-sm-6 text-center'>
                  <div className={classes.logoContainer}>
                    <div className={classes.logoImgSub}>
                      <img src={Helper.generateImageURL(values.logo)} className='companylogo' alt='logo dml' />
                    </div>
                    {activeEdit && <UploadFile onUploadComplete={data => {
                      setFieldValue('logo', APPCONFIG.REACT_APP_BACKEND_URL.concat(data.path.slice(1)))
                    }} />}
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-12'>
                  <Field
                    name='uptradeNetworkDescription'
                    label='UpTrade Network Company Description'
                    className={classes.textField + '98width'}
                    margin='normal'
                    multiline
                    row='6'
                    component={Input}
                    disabled={!activeEdit}
                  />
                </div>
                <div className='col-12'>
                  <label style={{ color: 'rgba(0, 0, 0, 0.54)', padding: '0', fontSize: '13px', fontFamily: 'Roboto', lineHeight: '1' }}>UpTrade Categories</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}
About.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(About)
