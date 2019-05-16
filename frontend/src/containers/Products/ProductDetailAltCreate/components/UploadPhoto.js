import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import UploadFile from '../../../../components/FileUpload'
import APPCONFIG from '../../../../config/AppConfig'
import { DeleteOutline } from '@material-ui/icons'

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
  box: {
    width: 250,
    height: 250
  },
  border: {
    border: '1px dashed black'
  },
  photo: {
    width: 100,
    height: 100
  },
  menu: {
    width: 200
  },
  iconDelete: {
    bottom: 0,
    right: 0,
    cursor: 'pointer',
    color: '#00B9AE'
  }
})
const Photo = ({ item, classes, index, handleRemove }) => (
  <div className='position-relative d-inline-flex shadow mr-1'>
    <DeleteOutline onClick={() => handleRemove(index)} className={`${classes.iconDelete} position-absolute`} />
    <img src={item} className={`${classes.photo}`} alt='logo dml' />
  </div>
)
class TextFields extends React.Component {
  state = {
    imageUrlList: []
  }
  render () {
    const { classes, setFieldValue, values } = this.props
    const { imageUrlList } = this.state

    return (
      <div className={classes.container}>
        <div className='container-fluid no-padding'>
          <div className='row'>
            <div className='col-sm-6 col-md-5'>
              {values.imageUrl && <img src={values.imageUrl[imageUrlList.length - 1]} className={`${classes.box} mx-auto d-block mb-4 shadow`} alt='logo dml' />}
              {!values.imageUrl && <div className={`${classes.border} ${classes.box} mx-auto mb-4`} />}
              <UploadFile onUploadComplete={(data) => {
                const newList = imageUrlList
                newList.push(APPCONFIG.REACT_APP_BACKEND_URL.concat(data.path))
                this.setState({ imageUrlList: newList })
                setFieldValue('imageUrl', imageUrlList)
              }} />
            </div>
            <div className='col-sm-6 col-md-7'>
              {imageUrlList.length > 1 && imageUrlList.map((item, index) => {
                if (index === imageUrlList.length - 1) { return false }
                return <Photo key={Math.random()} handleRemove={this.handleRemove} index={index} item={item} classes={classes} />
              }
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  handleRemove = (index) => {
    const { imageUrlList } = this.state
    const newList = imageUrlList
    newList.splice(index, 1)
    this.setState({ imageUrlList: newList })
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired
}

const TextFields1 = withStyles(styles)(TextFields)

const UploadPhoto = (props) => {
  return (
    <article className='article products closebox'>
      <div className='row'>
        <div className='col-sm-12'>
          <div className='box box-default'>
            <div className='box-header' />
            <div className='box-divider' />
            <div className='box-body'>
              <TextFields1 {...props} />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default UploadPhoto
