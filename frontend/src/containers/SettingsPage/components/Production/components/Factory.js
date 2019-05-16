import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'
import { withStyles } from '@material-ui/core/styles'
import { Field, FieldArray } from 'formik'

import Select from '../../../../../components/Select'
import Input from '../../../../../components/Input'
import CustomizeRadioButton from '../../../../../components/RadioButton/CustomizeRadioButton'
import Modal from '../../../../../components/Modal'
import Button from '../../../../../components/Button'
import { countriesOptions, portsOptions, productionsTypesOptions } from '../../../../DummyData'
import ToggleEditSaveInline from '../../../../../components/InlineBars/ToggleEditSaveInline'
import EditUploadImagesModal from '../../../../Products/components/EditUploadImagesModal'

const CarouselImage = (props) => {
  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
  }
  const { data, itemClassName } = props
  return (
    <Slider {...settings}>
      {data && data.map((image, index) => {
        return (
          <div key={index}>
            <div className={itemClassName}>
              <img src={image} className='img-responsive' style={{ display: 'block', borderRadius: '5px', margin: '10px auto' }} alt='logo' />
            </div>
          </div>
        )
      })}
    </Slider>
  )
}
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
  uploadImageBigSub: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadImageSmallSub: {
    textAlign: 'center'
  },
  menu: {
    width: 200
  }
})

class Productions extends React.Component {
  constructor (props) {
    super()
    this.state = {
      openPreview: false,
      previewImages: undefined,
      isOpenModal: false,
      imagesProduction: undefined,
      isSubmit: false
    }
  }
  handleUploadImages = images => {
    this.setState({
      isOpenModal: true,
      imagesProduction: images,
      openPreview: true
    })
  }
  handleSubmitModal = images => {
    const { cardActiveIndex } = this.props
    this.setState(
      {
        previewImages: images,
        isSubmit: true
      },
      () => {
        this.props.setFieldValue(`productions[${cardActiveIndex}].photos`, this.state.previewImages)
      }
    )
  }
  handleCloseModal = () => {
    this.setState({ isOpenModal: false })
  }
  render () {
    const {
      classes,
      handleToggleActiveEdit,
      cardActiveEdit,
      handleSubmit,
      values
    } = this.props
    let { previewImages, openPreview } = this.state
    const { isOpenModal, imagesProduction } = this.state
    let activeEdit = false
    let viewMode = 'show'
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <FieldArray
            name='productions'
            render={arrayHelpers => (
              values.productions && values.productions.map((item, index) => {
                if (cardActiveEdit === `activeProduction_${index}`) {
                  activeEdit = true
                  viewMode = 'edit'
                  previewImages = item.photos
                  openPreview = true
                } else {
                  activeEdit = false
                  viewMode = 'show'
                }
                let imageSection
                switch (viewMode) {
                  case 'show':
                    imageSection = (
                      <CarouselImage
                        itemClassName='carousel-product-item'
                        data={item.photos}
                      />
                    )
                    break
                  case 'edit':
                    imageSection = (
                      <div className='products-img-upload productions'>
                        {openPreview && (
                          <div className='preview-product-images'>
                            <CarouselImage
                              itemClassName='carousel-product-preview'
                              data={previewImages}
                            />
                          </div>
                        )}
                        <div
                          className={
                            previewImages && previewImages.length > 0
                              ? classes.uploadImageSmallSub
                              : classes.uploadImageBigSub
                          }
                        >
                          <Button
                            className={`btn-w-sm ${classes.greenButton}`}
                            handleClick={() => this.handleUploadImages(item.photos)}
                          >
                            Upload Images
                          </Button>
                        </div>
                      </div>
                    )
                    break
                  default:
                    return null
                }
                return (
                  <div className='box box-default' key={index}>
                    <div className='box-header'>{`Factory | ${item.name}`}
                      <ToggleEditSaveInline
                        title='Productions'
                        viewMode={viewMode}
                        editClickHandler={() => handleToggleActiveEdit('edit', index, `activeProduction_${index}`)}
                      />
                    </div>
                    <div className='box-divider' />
                    <div className='box-body'>
                      <div className='container'>
                        <div className='box-divider inline' />
                        <div className='row'>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]type`}
                              label='Type'
                              className={classes.textField}
                              margin='normal'
                              options={productionsTypesOptions}
                              component={Select}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-6 text-center' style={{ paddingLeft: '20px', paddingTop: '16px' }}>
                            <Field
                              name={`productions[${index}]visibleOnUptradeProfile`}
                              label='Visible on UpTrade Profile'
                              className={classes.textField}
                              margin='normal'
                              component={CustomizeRadioButton}
                              disabled={!activeEdit}
                            />
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]name`}
                              label='Name'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-6 col-lg-4'>
                            <Field
                              name={`productions[${index}]fullName`}
                              label='Full Name'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]country`}
                              label='Country'
                              className={classes.textField}
                              margin='normal'
                              options={countriesOptions}
                              component={Select}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]exportPort`}
                              label='Export Port'
                              className={classes.textField}
                              margin='normal'
                              options={portsOptions}
                              component={Select}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]gpsCoordinates`}
                              label='GPS Coordinates'
                              className={classes.textField}
                              margin='normal'
                              type='number'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]englishRoom`}
                              label='Room / Building'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]englishStreet`}
                              label='Street'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]englishDistrict`}
                              label='District'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]englishPostCode`}
                              label='Postcode'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]englishCity`}
                              label='City'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]englishProvince`}
                              label='Province'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]localRoom`}
                              label='Room / Building'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]localStreet`}
                              label='Street'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]localDistrict`}
                              label='District'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]localPostCode`}
                              label='Postcode'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]localCity`}
                              label='City'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]localProvince`}
                              label='Province'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]pcMonthCapacity`}
                              label='PC/Month Capacity'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]factorySize`}
                              label='Factory Size (sqm)'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]workers`}
                              label='Workers'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]qcInspectors`}
                              label='QC Inspectors'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                          <div className='col-sm-4 col-md-3 col-lg-2'>
                            <Field
                              name={`productions[${index}]r_and_d_employees`}
                              label='R&D Employees'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                            />
                          </div>
                        </div>

                        <div className='row'>
                          <div className='col-sm-6'>
                            <Field
                              name={`productions[${index}]products`}
                              label='Products'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                              multiline
                              row='6'
                            />
                          </div>
                          <div className='col-sm-6'>
                            <Field
                              name={`productions[${index}]additionalDetails`}
                              label='Contacts/Additional details'
                              className={classes.textField}
                              margin='normal'
                              component={Input}
                              disabled={!activeEdit}
                              multiline
                              row='6'
                            />
                          </div>
                        </div>

                        <div className='row' style={{ marginTop: '20px' }}>
                          <div className='col-sm-6'>
                            <label style={{ color: 'rgba(0, 0, 0, 0.54)', padding: '0', fontSize: '13px', fontFamily: 'Roboto', lineHeight: '1' }}>Images</label>
                            {imageSection}
                          </div>
                          <div className='col-sm-6'>
                            <label style={{ color: 'rgba(0, 0, 0, 0.54)', padding: '0', fontSize: '13px', fontFamily: 'Roboto', lineHeight: '1' }}>Documents</label>
                          </div>
                        </div>

                        {/* <div className='row' style={{ marginTop: '10px' }}>
                          <div className='col-12'>
                            <label style={{ color: 'rgba(0, 0, 0, 0.54)', padding: '0', fontSize: '13px', fontFamily: 'Roboto', lineHeight: '1' }}>Audits</label>
                            <List>
                              <ListItem style={{ borderBottom: '1px solid whitesmoke' }}>
                                <ListItemIcon>
                                  <AssignmentTurnedInIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary='BSCI Audit' secondary='Jan 7, 2014'
                                />
                                <ListItemSecondaryAction>
                                  <IconButton aria-label='Delete'>
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <AssignmentTurnedInIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary='Audit made by internal DML inspector' secondary='Oct 29, 2018'
                                />
                                <ListItemSecondaryAction>
                                  <IconButton aria-label='Delete'>
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            </List>
                          </div>
                        </div> */}

                      </div>
                    </div>
                  </div>
                )
              })
            )}
          />
        </form>
        <Modal isOpen={isOpenModal} handleClose={this.handleCloseModal}>
          <EditUploadImagesModal
            images={imagesProduction}
            handleCloseModal={this.handleCloseModal}
            handleSubmitModal={this.handleSubmitModal}
          />
        </Modal>
      </div>
    )
  }
}

Productions.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Productions)
