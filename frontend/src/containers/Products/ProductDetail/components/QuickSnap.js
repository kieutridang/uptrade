import React from 'react'
import Slider from 'react-slick'
import LightBox from 'react-images'

import { withStyles } from '@material-ui/core/styles'
import ToggleEditSaveProductBar from '../../../../components/InlineBars/ToggleEditSaveProductBar'
import Modal from '../../../../components/Modal'
import EditUploadImagesModal from '../../components/EditUploadImagesModal'
import Button from '../../../../components/Button'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'

const styles = theme => ({
  greenButton: {
    color: 'white',
    background: '#00B9AE',
    minHeight: '31px',
    fontSize: '80%',
    marginTop: '-5px'
  },
  uploadImageBigSub: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadImageSmallSub: {}
})

class CarouselImage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLightBoxOpen: false,
      currentImage: 0
    }
  }

  _handleOpenLightBox = () => {
    this.setState({ isLightBoxOpen: true })
  }

  _handleCloseLightBox = () => {
    this.setState({ isLightBoxOpen: false })
  }

  _gotoNextImage = () => {
    this.setState({ currentImage: this.state.currentImage + 1 })
  }

  _gotoPreviousImage = () => {
    this.setState({ currentImage: this.state.currentImage - 1 })
  }

  render() {
    const { data, itemClassName } = this.props
    const settings = {
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000
    }
    return (
      <div>
        <Slider {...settings}>
          {data &&
            data.map((image, index) => {
              return (
                <div key={index}>
                  <div className={itemClassName}>
                    <img alt='product' src={image} onClick={this._handleOpenLightBox} />
                  </div>
                </div>
              )
            })}
        </Slider>
        <LightBox
          currentImage={this.state.currentImage}
          onClickPrev={this._gotoPreviousImage}
          onClickNext={this._gotoNextImage}
          images={data.map(item => ({ src: item }))}
          isOpen={this.state.isLightBoxOpen}
          onClose={this._handleCloseLightBox}/>
      </div>
    )
  }
}

class QuickSnap extends React.Component {
  constructor (props) {
    super()
    this.state = {
      openPreview: false,
      previewImages: null,
      isOpenModal: false,
      imagesProduct: undefined,
      isSubmit: false
    }
  }
  handleSubmitModal = images => {
    this.setState(
      {
        previewImages: images,
        isSubmit: true
      },
      () => {
        this.props.setFieldValue('imageUrl', this.state.previewImages)
      }
    )
  };
  handleUploadImages = images => {
    this.setState({
      isOpenModal: true,
      imagesProduct: images,
      openPreview: true
    })
  };
  handleCloseModal = () => {
    this.setState({ isOpenModal: false })
  };
  render () {
    const {
      data: { essentials, descriptions, logistics, cost },
      handleToggleActiveEdit,
      openImagesPreviewCarouselQuick,
      viewMode,
      handleSubmit,
      classes,
      dirty,
      isSubmitting
    } = this.props
    const { isOpenModal, imagesProduct, isSubmit } = this.state
    let { previewImages, openPreview } = this.state
    if (essentials.imageUrl) {
      previewImages = essentials.imageUrl
    }

    let quickViewCategory = ''
    quickViewCategory = essentials.category
    if (essentials.subCategory && essentials.category) { quickViewCategory = essentials.subCategory + '|' + essentials.category }
    let qvLogistics = {
      pack: '',
      vol: '',
      units: ''
    }

    if (logistics) {
      if (logistics.packaged) qvLogistics.pack = logistics.packaged.pack || ''
      if (logistics.exportCarton) { qvLogistics.vol = logistics.exportCarton.volume || '' }
      if (logistics.exportCarton) { qvLogistics.units = logistics.exportCarton.units || '' }
    }

    openPreview = openImagesPreviewCarouselQuick
    let imageSection
    switch (viewMode) {
      case 'show':
        imageSection = (
          <CarouselImage
            itemClassName='carousel-product-item'
            data={essentials.imageUrl}
          />
        )
        break
      case 'edit':
        imageSection = (
          <div className='products-img-upload'>
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
                handleClick={() => this.handleUploadImages(essentials.imageUrl)}
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
      <form onSubmit={handleSubmit}>
        <BlockNavigationComponent open={dirty && !isSubmitting} />
        <article className='article products closebox'>
          <div className='row'>
            <div className='col-sm-12 margin-top-20'>
              <div className='box box-default'>
                <div className='box-header'>
                  QuickView
                  <ToggleEditSaveProductBar
                    title='Quick Snap'
                    viewMode={viewMode}
                    editClickHandler={() =>
                      handleToggleActiveEdit &&
                      handleToggleActiveEdit('activeQuickSnapEdit')
                    }
                    saveDisabled={!isSubmit}
                  />
                </div>
                <div className='box-divider' />
                <div className='box-body no-padding'>
                  <div className='item-card card__horizontal'>
                    <div className='card__image'>{imageSection}</div>
                    <div className='card__body card-white'>
                      <div className='card__body-head'>
                        <div className='card__title'>
                          {essentials.itemNumber &&
                            `${essentials.itemNumber} | `}
                          {essentials.itemName}
                          <span>
                            <b>Permanent</b>
                          </span>
                          <span>{quickViewCategory}</span>
                        </div>
                        <div className='card__price-product'>
                          {cost && cost.totalProductCost && (
                            <span className=''>{`${
                              cost.totalProductCost.currency
                            } ${cost.totalProductCost.cost} / 1`}</span>
                          )}
                          {logistics &&
                            logistics.incoterm &&
                            logistics.port && (
                            <span>{`${logistics.incoterm} ${
                              logistics.port
                            }`}</span>
                          )}
                        </div>
                      </div>
                      <div className='divider divider-solid my-4' />
                      <h5>Short description</h5>
                      <p className='card__desc'>
                        {descriptions && descriptions.shortDescription}
                      </p>
                      <table className='mdl-data-table condensedtable fulltable'>
                        <thead>
                          <tr>
                            <th>Packaging</th>
                            <th>MOQ</th>
                            <th>Carton Pack</th>
                            <th>CBM</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{qvLogistics.pack}</td>
                            <td>{essentials.MOQ}</td>
                            <td>{qvLogistics.units}</td>
                            <td>{qvLogistics.vol}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
        <Modal isOpen={isOpenModal} handleClose={this.handleCloseModal}>
          <EditUploadImagesModal
            images={imagesProduct}
            handleCloseModal={this.handleCloseModal}
            handleSubmitModal={this.handleSubmitModal}
          />
        </Modal>
      </form>
    )
  }
}

export default withStyles(styles)(QuickSnap)
