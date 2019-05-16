import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import UploadFile from '../../../components/FileUpload/MultipleUpload'
import APPCONFIG from '../../../config/AppConfig'
import Button from '../../../components/Button'

const styles = theme => ({
  optionUpload: {

  },
  imagesSub: {

  },
  imagesContainer: {
    maxHeight: '400px',
    overflow: 'scroll'
  },
  imageSub: {
    display: 'inline-block',
    height: '150px',
    width: '200px',
    margin: '10px',
    position: 'relative'
  },
  image: {
    maxWidth: '200px',
    maxHeight: '150px',
    border: '1px solid ',
    borderRadius: '3px'
  },
  inlinetoolbutton: {
    height: '35px',
    width: '35px',
    position: 'absolute',
    top: '0',
    left: '0',
    color: 'red'
  },
  inlineIcon: {
    marginTop: '-7px'
  },
  greenButton: {
    color: 'white',
    background: '#00B9AE',
    minHeight: '31px',
    fontSize: '80%',
    marginTop: '-5px',
    marginRight: '10px'
  }
})
class EditUploadImagesModal extends React.Component {
  constructor (props) {
    super()
    this.state = {
      imagesArray: props.images || []
    }
  }
  deleteImage = (item) => {
    const currentImagesArray = this.state.imagesArray
    const index = currentImagesArray.indexOf(item)
    currentImagesArray.splice(index, 1)
    this.setState({
      imagesArray: currentImagesArray
    })
  }
  handleChooseImages = (data) => {
    const currentImagesArray = this.state.imagesArray
    data.forEach(element => {
      currentImagesArray.push(APPCONFIG.REACT_APP_BACKEND_URL.concat(element.path))
    })
    this.setState({
      imagesArray: currentImagesArray
    })
  }
  handleSubmit = () => {
    this.props.handleSubmitModal(this.state.imagesArray)
    this.props.handleCloseModal()
  }
  render () {
    const { classes } = this.props
    const { imagesArray } = this.state
    return (
      <div className='container'>
        <div className={classes.optionUpload}>
          <Button className={`btn-w-sm ${classes.greenButton}`} handleClick={this.handleSubmit}>Submit</Button>
          <UploadFile multiple='multiple' onUploadComplete={this.handleChooseImages} />
        </div>
        <div className={classes.imagesContainer}>
          <div className={classes.imagesSub}>
            {imagesArray && imagesArray.map((image, index) => {
              return (
                <div className={classes.imageSub} key={index}>
                  <img className={classes.image} src={image} alt='product' />
                  <IconButton aria-label='Delete' className={classes.inlinetoolbutton} onClick={() => this.deleteImage(image)}>
                    <CloseIcon className={classes.inlineIcon} />
                  </IconButton>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(EditUploadImagesModal)
