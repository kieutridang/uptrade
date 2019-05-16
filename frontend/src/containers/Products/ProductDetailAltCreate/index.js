import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import Essentials from './components/Essentials'
import Supplier from './components/Supplier'
import Descriptions from './components/Descriptions'
// import UploadPhoto from './components/UploadPhoto'
import FormModel from '../../../components/FormModel'
import Button from '../../../components/Button'
import { productLightCreateValidationSchema } from '../ProductDetailAlt/productDetailAlt.validations'
import { initialProductValues } from '../product.initialOriginalValues'
import { MUTATION_CREATE_PRODUCT_SHEET } from '../products.typedef'
import { QUERY_COMPANY } from '../../SuperAdmin/Clients/client.typedef'
import { BlockNavigationComponent } from '../../../components/BlockNavigation'
// import { QUERY_EVENTS } from '../../Event/event.typedef'
import { QUERY_SUPPLIERS } from '../../Suppliers/supplier.typedef'
import { ComponentLoading } from '../../../components/Loading'

class Form extends React.Component {
  componentDidUpdate (prevProps) {
    if ((prevProps.isSubmitting && !this.props.isSubmitting) || (prevProps.isValid && !this.props.isValid)) {
      if (this.props.errors.hasOwnProperty('form') === false) {
        const keys = Object.keys(this.props.errors)
        const errorElement = document.getElementById(keys[0])
        const coordinates = errorElement.getBoundingClientRect()
        window.scrollTo(coordinates.x, coordinates.y)
      }
    }
  }
  render () {
    const {
      handleSubmit,
      errors,
      isSubmitting,
      dirty
    } = this.props
    return (
      <form onSubmit={handleSubmit} id='create-event-product-form'>
        <BlockNavigationComponent open={dirty && !isSubmitting} />
        {/* <div key='1'><UploadPhoto {...props} /></div> */}
        <div key='2'><Essentials {...this.props} /></div>
        <div key='3'><Supplier {...this.props} /></div>
        <div key='4'><Descriptions /></div>
        <span className='error-message'>{errors['form']}</span>
        <div className='text-center mb-5'>
          <Button typeClass='green-button' type='submit' id='create-event-product-button'>Create product</Button>
        </div>
      </form>
    )
  }
}

class ProductDetailAltCreate extends React.Component {
  render () {
    const { getSupplier, getCompany } = this.props
    if (getSupplier.loading) {
      return <ComponentLoading />
    } else {
      const { suppliers } = getSupplier.companySuppliers
      let categoryData
      if (!getCompany.loading && getCompany.company) {
        categoryData = getCompany.company.productSettings
      }
      return (
        <div style={{ padding: 24, backgroundColor: '#f5f5f5' }}>
          <QueueAnim type='bottom' className='ui-animate'>
            <FormModel
              schema={productLightCreateValidationSchema}
              initialValues={initialProductValues}
              submitHandler={this.handleSubmit}
              component={<Form
                suppliers={suppliers}
                categoryDataList={categoryData}
              />}
            />
          </QueueAnim>
        </div>
      )
    }
  }
  handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const { history, createProductSheet, match } = this.props
    const {
      category,
      subCategory,
      brand,
      essentialsItemNumber,
      itemName,
      MOQ,
      testCertificate,
      formAE,
      leadTime,
      sampleCost,
      sampleLeadTime,
      imageUrl,
      supplierItemNumber,
      _id,
      // factorySubcontractor,
      // contactName,
      contactPhone,
      color,
      customerItemNumber,
      exclusivity,
      shortDescription,
      longDescription,
      composition,
      internalRemark,
      marketPlaceDescription,
      customFields

    } = values
    let formattedCustomFields = []
    if (customFields) {
      formattedCustomFields = customFields.map(item => {
        const key = Object.keys(item)[0]
        return {
          fieldName: key,
          value: item[key]
        }
      })
    }
    const product = {
      essentials: {
        itemStatus: 'SOURCING',
        category,
        subCategory,
        brand,
        itemNumber: essentialsItemNumber,
        itemName,
        MOQ,
        testCertificate: testCertificate,
        formAE,
        leadTime,
        sampleCost,
        sampleLeadTime,
        imageUrl,
        customFields: formattedCustomFields
      },
      supplier: [{
        itemNumber: supplierItemNumber,
        _id,
        // factorySubcontractor,
        // contactName,
        contactPhone
      }],
      descriptions: {
        color,
        customerItemNumber,
        exclusivity,
        shortDescription,
        longDescription,
        composition,
        internalRemark,
        marketPlaceDescription
      },
      users: {
        productManager: '',
        procurementManager: '',
        qualityManager: '',
        marketingManager: ''
      },
      status: 'NONE'
    }
    setSubmitting(true)
    try {
      const response = await createProductSheet({
        variables: {
          product,
          eventId: match.params.id
        }
      })
      if (response && response.data && response.data.createProductSheet) {
        const id = response.data.createProductSheet._id
        history.push(`/events/${match.params.id}/products/${id}`)
      }
    } catch (exception) {
      const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
      setErrors({
        form: msg
      })
    }
    setSubmitting(false)
  }
}

export default compose(
  graphql(MUTATION_CREATE_PRODUCT_SHEET, { name: 'createProductSheet' }),
  graphql(QUERY_SUPPLIERS, {
    name: 'getSupplier',
    options: props => {
      return {
        variables: {
          limit: -1
        }
      }
    }
  }),
  graphql(QUERY_COMPANY, {
    name: 'getCompany',
    options: props => {
      return {
        variables: {
          companyUptradeID: window.localStorage.getItem('companyUptradeID')
        }
      }
    }
  })
)(ProductDetailAltCreate)
