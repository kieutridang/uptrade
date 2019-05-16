import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Check from '@material-ui/icons/Check'
import Favorite from '@material-ui/icons/Favorite'
import { Link } from 'react-router-dom'

import ProductBarSourcing from '../../../../components/InlineBars/ProductBarSourcing/index'
import Carousel from '../../../../components/Carousel'
import Button from '../../../../components/Button'
import Modal from '../../../../components/Modal'
import EditUploadImagesModal from '../../components/EditUploadImagesModal'

import '../index.scss'

const styles = {
  inlineli: {
    marginRight: '1.5rem',
    height: '0.7rem',
    width: '0.7rem'
  },
  buttoninline: {
    top: '12px'
  },
  inlinelifirst: {
    marginRight: '4rem',
    height: '0.7rem',
    width: '0.7rem'
  },
  inlinetoolbutton: {
    height: '35px',
    width: '35px',
    marginTop: '5px'
  },
  inlinetoolbuttonsuccess: {
    color: 'green',
    height: '35px',
    width: '35px',
    marginTop: '5px'
  },
  inlinetoolbuttonred: {
    color: '#DB5461',
    height: '35px',
    width: '35px',
    marginTop: '5px'
  },
  viewBtn: {
    position: 'absolute',
    top: '12px',
    right: '30px'
  },
  inlineIcon: {
    marginTop: '-7px'
  },
  interestIcon: {
    marginTop: '-7px',
    color: '#DB5461'
  },
  greenButton: {
    color: 'white',
    background: '#00B9AE',
    minHeight: '31px',
    fontSize: '80%',
    marginTop: '-5px'
  },
  uploadImageBigSub: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadImageSmallSub: {}
}

class QuickSnap extends React.Component {
  state = {
    isOpenModal: false,
    imagesProduct: undefined,
    previewImages: null
  }
  handleSubmitModal = images => {
    this.setState(
      {
        previewImages: images
      },
      () => {
        this.props.setFieldValue('essentials.imageUrl', this.state.previewImages)
      }
    )
  }
  handleUploadImages = images => {
    this.setState({
      isOpenModal: true,
      imagesProduct: images,
      openPreview: true
    })
  };

  handleCloseModal = () => {
    this.setState({ isOpenModal: false })
  }
  renderImageSection = () => {
    const { viewMode, values } = this.props
    const { previewImages } = this.state
    switch (viewMode) {
      case 'show':
        return (
          <Carousel className='carousel' autoplay data={values && values.essentials && values.essentials.imageUrl} />
        )
      case 'edit':
        return (
          <div className='products-img-upload'>
            {
              <div className='preview-product-images'>
                <Carousel className='carousel' autoplay data={values && values.essentials && values.essentials.imageUrl} />
              </div>
            }
            <div
              style={
                previewImages && previewImages.length > 0
                  ? styles.uploadImageSmallSub
                  : styles.uploadImageBigSub
              }
            >
              <Button
                className={`btn-w-sm`}
                style={styles.greenButton}
                handleClick={() => this.handleUploadImages(values.essentials.imageUrl)}
              >
                Upload Images
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }
  render () {
    const { values, product, handleChangeStatus, handleToggleActiveEdit, viewMode, saveDisabled } = this.props
    const { isOpenModal, imagesProduct } = this.state
    return (
      <article className='article products closebox'>
        <div className='row article-notitle'>
          <div className='col-sm-12'>
            <div className='box box-default'>
              <div className='box-header'>
                QuickView
                <ProductBarSourcing saveDisabled={saveDisabled} viewMode={viewMode} editClickHandler={() => handleToggleActiveEdit && handleToggleActiveEdit('activeProductEdit')} />
              </div>
              <div className='box-divider' />
              <div className='box-body no-padding'>
                <div className='item-card card__horizontal'>
                  <div className='card__image imgcard_alt'>
                    {/* <img src={values.imageUrl[0]} alt='' /> */}
                    {this.renderImageSection()}
                    {/* <Carousel className='carousel' autoplay data={values.essentials.imageUrl} /> */}
                  </div>
                  <div className='card__body card-white bodycard_alt'>
                    <div className='card__title'>
                      { values.essentials && values.essentials.itemNumber && `${values.essentials.itemNumber} | `}
                      { values.essentials && values.essentials.itemName}
                      <span>{values.essentials && values.essentials.category && values.essentials.category} / {values.essentials && values.essentials.subCategory && values.essentials.subCategory}</span></div>
                    {
                      product && product.status === 'PRODUCTS'
                        ? <Link to={`/products/detail/${product._id}`}><Button typeClass='green-button' style={styles.viewBtn}>VIEW IN PRODUCTS</Button></Link>
                        : <div className='card_price' style={styles.buttoninline}><span className=''>
                          <ul className='list-unstyled list-inline headericons float-right'>
                            <li style={styles.inlineli} className='list-inline-item'>
                              <Tooltip title='Added to Products'>
                                <IconButton onClick={() => handleChangeStatus('PRODUCTS')} aria-label='Added to Products' style={styles.inlinetoolbuttonsuccess} className='greenicon'>
                                  <Check style={styles.inlineIcon} />
                                </IconButton>
                              </Tooltip>
                            </li>
                            <li style={styles.inlineli} className='list-inline-item'>
                              <Tooltip title='Interest'>
                                <IconButton onClick={() => product && product.status === 'PRODUCTS' ? handleChangeStatus('INTEREST') : handleChangeStatus('NONE')} aria-label='Mark as interesting' style={styles.inlinetoolbuttonred} className='redicon'>
                                  {
                                    product && product.status === 'PRODUCTS'
                                      ? <Favorite style={styles.interestIcon} />
                                      : <Favorite style={styles.inlineIcon} />
                                  }
                                </IconButton>
                              </Tooltip>
                            </li>
                          </ul></span>
                        </div>
                    }
                    <p className='card__desc'>{values && values.descriptions && values.descriptions.shortDescription}</p>
                    <br /><p className='card__desc'>Packaging: {values.pack}</p>
                  </div></div>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={isOpenModal} handleClose={this.handleCloseModal}>
          <EditUploadImagesModal
            images={imagesProduct}
            handleCloseModal={this.handleCloseModal}
            handleSubmitModal={this.handleSubmitModal}
          />
        </Modal>
      </article>
    )
  }
}

export default QuickSnap
