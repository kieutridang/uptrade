import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { compose, withStateHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import _ from 'lodash'

import QuickSnapAlt from './components/QuickSnapAlt'
import EssentialsAlt from './components/EssentialsAlt'
// import Actions from './components/Actions'
import { ComponentLoading } from '../../../components/Loading'
import { QUERY_PRODUCT, MUTATION_UPDATE_STATUS_PRODUCT, MUTATION_UPDATE_LIGHT_PRODUCT_SHEET } from '../products.typedef'
import FormModel from '../../../components/FormModel'
import { productSheetValidationSchema } from './productDetailAlt.validations'
import { QUERY_SUPPLIERS } from '../../Suppliers/supplier.typedef'
import countryData from '../../../assets/countryData'

const styles = {
  container: {
    padding: '24px',
    marginTop: '-24px',
    backgroundColor: '#f5f5f5',
    minHeight: 'calc(100vh - 80px)'
  }
}

const Form = (props) => {
  const { product } = props.getProduct
  const { handleSubmit, viewMode, isSubmitting } = props
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
    <form onSubmit={handleSubmit}>
      <div key='1'><QuickSnapAlt saveDisabled={isSubmitting} activeEdit={activeEdit} product={product} {...props} /></div>
      <div key='2'><EssentialsAlt activeEdit={activeEdit} {...props} /></div>
      {/* <div key='3'><Actions /></div> */}
    </form>
  )
}

class Page extends React.Component {
  componentWillMount () {
    const { getProduct, getSuppliers } = this.props
    getProduct.refetch()
    getSuppliers.refetch()
  }
  render () {
    const { getProduct, getSuppliers, viewLightProduct, handleToggleActiveEdit, openImagesPreviewCarouselQuick } = this.props
    if (getProduct.loading) {
      return <ComponentLoading />
    } else {
      const { suppliers } = !getSuppliers.loading && getSuppliers.companySuppliers
      const productDetail = getProduct.product
      if (productDetail && productDetail.logistics && productDetail.logistics.origin && typeof productDetail.logistics.origin === 'string') {
        productDetail.logistics.origin = countryData.find(element => {
          return element.common === productDetail.logistics.origin
        })
      }
      if (productDetail && productDetail.essentials && typeof productDetail.essentials.testCertificate === 'boolean') {
        productDetail.essentials.testCertificate = (productDetail.essentials.testCertificate && 'Yes') || 'No'
      }
      return (
        <div style={styles.container}>
          <QueueAnim type='bottom' className='ui-animate'>
            <FormModel
              schema={productSheetValidationSchema}
              initialValues={productDetail}
              submitHandler={this.handleSubmit}
              component={<Form
                openImagesPreviewCarouselQuick={openImagesPreviewCarouselQuick}
                viewMode={viewLightProduct}
                suppliers={suppliers}
                handleChangeStatus={this.handleChangeStatus}
                handleToggleActiveEdit={handleToggleActiveEdit}
                {...this.props}
              />}
            />
          </QueueAnim>
        </div>
      )
    }
  }
  handleChangeStatus = async (status) => {
    const { updateStatusProduct, match, getProduct } = this.props
    const { refetch } = getProduct
    await updateStatusProduct({
      variables: {
        id: match.params.productId,
        status,
        companyUptradeID: window.localStorage.getItem('companyUptradeID')
      }
    })
    refetch()
  }

  handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const { updateProduct, match, handleToggleActiveEdit, getSuppliers } = this.props
    try {
      setSubmitting(true)
      const product = {
        itemName: _.get(values, ['essentials', 'itemName'], ''),
        imageUrl: _.get(values, ['essentials', 'imageUrl'], ''),
        testCertificate: values.essentials.testCertificate === 'Yes',
        supplierCurrency: _.get(values, ['cost', 'productsCost', 0, 'currency'], ''),
        supplier: [],
        factoryPrice: _.get(values, ['cost', 'productsCost', 0, 'cost'], 0),
        sellingPrice: _.get(values, ['cost', 'marketPlacePrice', 'cost'], 0),
        sellingCurrency: _.get(values, ['cost', 'marketPlacePrice', 'currency'], ''),
        unit: _.get(values, ['logistics', 'unit', 'units'], ''),
        MOQ: _.get(values, ['essentials', 'MOQ'], 0),
        incoterm: _.get(values, ['logistics', 'incoterm'], ''),
        country: _.get(values, ['logistics', 'origin', 'common'], ''),
        port: _.get(values, ['logistics', 'port'], ''),
        sizeW: _.get(values, ['logistics', 'unit', 'w'], 0),
        sizeH: _.get(values, ['logistics', 'unit', 'h'], 0),
        sizeL: _.get(values, ['logistics', 'unit', 'l'], 0),
        cartonPack: _.get(values, ['logistics', 'exportCarton', 'units'], ''),
        CBM: _.get(values, ['logistics', 'exportCarton', 'volume']),
        leadTime: _.get(values, ['essentials', 'leadTime'], ''),
        sampleCost: _.get(values, ['essentials', 'sampleCost'], 0),
        sampleLeadTime: _.get(values, ['essentials', 'sampleLeadTime'], ''),
      }
      if (_.get(values, ['supplier', 0], false)) {
        product.supplier = [{
          _id: values.supplier[0]._id
        }]
      }
      const response = await updateProduct({
        variables: {
          id: match.params.productId,
          product
        }
      })
      if (response && response.data && response.data.updateLightProductSheet) {
        handleToggleActiveEdit('activeProductShow')
      }
    } catch (exception) {
      console.error(exception)
      const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
      setErrors({
        form: msg
      })
    }
    getSuppliers.refetch()
    setSubmitting(false)
  }
}

export default compose(
  graphql(QUERY_PRODUCT,
    {
      name: 'getProduct',
      options: props => {
        return {
          variables: {
            id: props.match.params.productId
          }
        }
      }
    }
  ),
  graphql(MUTATION_UPDATE_STATUS_PRODUCT,
    {
      name: 'updateStatusProduct'
    }
  ),
  graphql(MUTATION_UPDATE_LIGHT_PRODUCT_SHEET,
    {
      name: 'updateProduct'
    }
  ),
  graphql(QUERY_SUPPLIERS, {
    name: 'getSuppliers',
    options: props => {
      return {
        variables: {
          limit: -1
        }
      }
    }
  }),
  withStateHandlers(
    ({
      viewLightProduct = 'show',
      openImagesPreviewCarouselQuick = false
    }) => ({
      viewLightProduct,
      openImagesPreviewCarouselQuick
    }), {
      handleToggleActiveEdit: () => (name) => {
        switch (name) {
          case 'activeProductEdit': {
            return {
              viewLightProduct: 'edit',
              openImagesPreviewCarouselQuick: true
            }
          }
          case 'activeProductShow': {
            return { viewLightProduct: 'show' }
          }
          default: return {}
        }
      }
    }
  )
)(Page)
