import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { graphql } from 'react-apollo'
import { compose, withStateHandlers } from 'recompose'

import FormModel from '../../../components/FormModel'
import { ComponentLoading } from '../../../components/Loading'
import QuickSnap from './components/QuickSnap'
import Essentials from './components/Essentials'
import Supplier from './components/Supplier'
import Descriptions from './components/Descriptions'
import Cost from './components/Cost'
import Logistic from './components/Logistic'
import Users from './components/Users'

import { QUERY_PRODUCT, MUTATION_UPDATE_PRODUCT } from '../products.typedef'
import { QUERY_SUPPLIERS } from '../../Suppliers/supplier.typedef'
import { QUERY_COMPANY } from '../../SuperAdmin/Clients/client.typedef'
import { initialUsersProduct } from '../product.initialOriginalValues'
import countryData from '../../../assets/countryData'
import {
// essentialsValidationSchema,
// supplierValidationSchema,
// descriptionvalidationSchema,
// costValdiationSchema,
// logisticsValidationSchema,
// usersValdiationSchema
} from '../products.validations'

class ProductDetail extends React.Component {
  render () {
    const {
      getProduct,
      getCompany,
      getSuppliers,

      viewSupplierMode,
      viewQuickSnapMode,
      viewDescriptionMode,
      viewEssentialsMode,
      viewUsersMode,
      viewCostMode,
      viewLogisticsMode,
      openImagesPreviewCarouselQuick,

      submitUpdateEssentialHandler,
      submitUpdateSupplierHandler,
      submitUpdateDescriptionHandler,
      submitUpdateCostHandler,
      submitUpdateLogisticsHandler,
      submitUpdateUsersHandler,
      submitUpdateQuickSnapHandler,

      handleToggleActiveEdit
    } = this.props
    if (getProduct.loading || getSuppliers.loading) {
      return <ComponentLoading />
    } else {
      const { suppliers } = getSuppliers.companySuppliers
      const productDetail = getProduct.product
      const company = !getCompany.loading && getCompany.company
      const initialUsers = initialUsersProduct(productDetail.users)
      let categoryData
      if (getCompany.company) {
        categoryData = getCompany.company.productSettings
      }
      if (productDetail && productDetail.logistics && productDetail.logistics.origin && typeof productDetail.logistics.origin === 'string') {
        productDetail.logistics.origin = countryData.find(element => {
          return element.common === productDetail.logistics.origin
        })
      }
      return (
        productDetail && <div style={{ padding: 24, backgroundColor: '#f5f5f5' }}>
          <QueueAnim type='bottom' className='ui-animate'>
            <div key='1'>
              <FormModel
                initialValues={productDetail.essentials}
                submitHandler={submitUpdateQuickSnapHandler}
                component={<QuickSnap
                  viewMode={viewQuickSnapMode}
                  data={productDetail}
                  handleToggleActiveEdit={handleToggleActiveEdit}
                  openImagesPreviewCarouselQuick={openImagesPreviewCarouselQuick}
                />}
              />
            </div>
            <div key='2'>
              <FormModel
                // schema={essentialsValidationSchema}
                initialValues={productDetail.essentials}
                submitHandler={submitUpdateEssentialHandler}
                component={<Essentials
                  viewMode={viewEssentialsMode}
                  handleToggleActiveEdit={handleToggleActiveEdit}
                  categoryDataList={categoryData}
                  {...this.props}
                />}
              />
            </div>
            <div key='3'>
              <FormModel
                // schema={supplierValidationSchema}
                initialValues={productDetail}
                submitHandler={submitUpdateSupplierHandler}
                component={<Supplier
                  viewMode={viewSupplierMode}
                  handleToggleActiveEdit={handleToggleActiveEdit}
                  suppliers={suppliers}
                  {...this.props}
                />}
              />
            </div>
            <div key='4'>
              <FormModel
                // schema={descriptionvalidationSchema}
                initialValues={productDetail.descriptions}
                submitHandler={submitUpdateDescriptionHandler}
                component={<Descriptions
                  viewMode={viewDescriptionMode}
                  handleToggleActiveEdit={handleToggleActiveEdit}
                  {...this.props}
                />}
              />
            </div>
            <div key='5'>
              <FormModel
                // schema={costValdiationSchema}
                initialValues={productDetail}
                submitHandler={submitUpdateCostHandler}
                component={<Cost
                  viewMode={viewCostMode}
                  handleToggleActiveEdit={handleToggleActiveEdit}
                  {...this.props}
                />}
              />
            </div>
            <div key='6'>
              <FormModel
                // schema={usersValdiationSchema}
                initialValues={initialUsers}
                submitHandler={submitUpdateUsersHandler}
                component={<Users
                  users={company && company._users}
                  viewMode={viewUsersMode}
                  handleToggleActiveEdit={handleToggleActiveEdit}
                  {...this.props}
                />}
              />
            </div>
            <div key='7'>
              <FormModel
                // schema={logisticsValidationSchema}
                initialValues={productDetail.logistics}
                submitHandler={submitUpdateLogisticsHandler}
                component={<Logistic
                  viewMode={viewLogisticsMode}
                  handleToggleActiveEdit={handleToggleActiveEdit}
                  {...this.props}
                />}
              />
            </div>
          </QueueAnim>
        </div>
      )
    }
  }
}

export default compose(
  graphql(QUERY_PRODUCT, {
    name: 'getProduct',
    options: props => {
      return {
        variables: {
          id: props.match.params.id
        }
      }
    }
  }),
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
  graphql(MUTATION_UPDATE_PRODUCT, {
    name: 'updateProduct'
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
  }),
  withStateHandlers(
    (_) => ({}), {
      refetchGetProduct: (_, { getProduct }) => () => {
        const { refetch } = getProduct
        refetch()
      },
      refetchGetSupplier: (_, { getSuppliers }) => () => {
        const { refetch } = getSuppliers
        refetch()
      }
    }),
  withStateHandlers(
    ({
      viewSupplierMode = 'show',
      viewDescriptionMode = 'show',
      viewEssentialsMode = 'show',
      viewQuickSnapMode = 'show',
      viewUsersMode = 'show',
      viewCostMode = 'show',
      viewLogisticsMode = 'show',
      openImagesPreviewCarouselQuick = false
    }) => ({
      viewSupplierMode,
      viewDescriptionMode,
      viewEssentialsMode,
      viewQuickSnapMode,
      viewUsersMode,
      viewCostMode,
      viewLogisticsMode,
      openImagesPreviewCarouselQuick
    }), {
      handleToggleActiveEdit: (_, { refetchGetSupplier }) => (name) => {
        switch (name) {
          case 'activeSupplierEdit': {
            refetchGetSupplier()
            return { viewSupplierMode: 'edit' }
          }
          case 'activeDescriptionEdit': {
            return { viewDescriptionMode: 'edit' }
          }
          case 'activeEssentialsEdit': {
            return { viewEssentialsMode: 'edit' }
          }
          case 'activeQuickSnapEdit': {
            return {
              viewQuickSnapMode: 'edit',
              openImagesPreviewCarouselQuick: true
            }
          }
          case 'activeUsersEdit': {
            return { viewUsersMode: 'edit' }
          }
          case 'activeCostEdit': {
            return { viewCostMode: 'edit' }
          }
          case 'activeLogisticsEdit': {
            return { viewLogisticsMode: 'edit' }
          }
          case 'activeSupplierShow': {
            return { viewSupplierMode: 'show' }
          }
          case 'activeDescriptionShow': {
            return { viewDescriptionMode: 'show' }
          }
          case 'activeEssentialsShow': {
            return { viewEssentialsMode: 'show' }
          }
          case 'activeQuickSnapShow': {
            return { viewQuickSnapMode: 'show' }
          }
          case 'activeUsersShow': {
            return { viewUsersMode: 'show' }
          }
          case 'activeCostShow': {
            return { viewCostMode: 'show' }
          }
          case 'activeLogisticsShow': {
            return { viewLogisticsMode: 'show' }
          }
          default: return {}
        }
      }
    }
  ),
  withStateHandlers(
    (_) => ({}), {
      submitUpdateQuickSnapHandler: (_, { refetchGetProduct, updateProduct, match, handleToggleActiveEdit }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          delete values.__typename
          const product = {
            essentials: values
          }
          const response = await updateProduct({
            variables: {
              id: match.params.id,
              product
            },
            refetchQueries: [{
              query: QUERY_PRODUCT,
              variables: {
                id: match.params.id
              }
            }]
          })

          if (response && response.data && response.data.updateProduct) {
            refetchGetProduct()
            handleToggleActiveEdit('activeQuickSnapShow')
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        }
        setSubmitting(false)
      },
      submitUpdateEssentialHandler: (_, props) => (values, { setSubmitting, setErrors }) => {
        const { refetchGetProduct, updateProduct, match, handleToggleActiveEdit } = props
        setSubmitting(true)
        const customFields = values.customFields
        if (customFields) {
          customFields.forEach(item => {
            delete item.__typename
          })
        }
        delete values.__typename
        const product = {
          essentials: values
        }

        updateProduct({
          variables: {
            id: match.params.id,
            product
          }
        }).then(response => {
          if (response && response.data && response.data.updateProduct) {
            refetchGetProduct()
            handleToggleActiveEdit('activeEssentialsShow')
          }
        }).catch(exception => {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        })
        setSubmitting(false)
      },
      submitUpdateSupplierHandler: (_, { refetchGetProduct, refetchGetSupplier, updateProduct, match, handleToggleActiveEdit }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          let supplier = values.supplier.map(item => {
            let newItem = JSON.parse(JSON.stringify(item))
            delete newItem.__typename
            delete newItem.contactPhone
            delete newItem.contactEmail
            return newItem
          })
          supplier = supplier && supplier.filter(item => item._id)
          const product = {
            supplier
          }
          const response = await updateProduct({
            variables: {
              id: match.params.id,
              product
            }
          })
          if (response && response.data && response.data.updateProduct) {
            refetchGetProduct()
            refetchGetSupplier()
            handleToggleActiveEdit('activeSupplierShow')
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        }
        setSubmitting(false)
      },
      submitUpdateDescriptionHandler: (_, { refetchGetProduct, updateProduct, match, handleToggleActiveEdit }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          delete values.__typename
          const product = {
            descriptions: values
          }
          const response = await updateProduct({
            variables: {
              id: match.params.id,
              product
            }
          })
          if (response && response.data && response.data.updateProduct) {
            refetchGetProduct()
            handleToggleActiveEdit('activeDescriptionShow')
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        }
        setSubmitting(false)
      },
      submitUpdateCostHandler: (_, { refetchGetProduct, updateProduct, match, handleToggleActiveEdit }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          const productCost = values.cost
          delete productCost.__typename
          if (productCost.productsCost) {
            productCost.productsCost.forEach(item => {
              return delete item.__typename
            })
          }
          const fieldsNeedToRemoveTypename = ['marketPlacePrice', 'recoSellingPrice', 'retailRecoPrice', 'totalProductCost']
          Object.entries(productCost).forEach(key => {
            if (fieldsNeedToRemoveTypename.includes(key[0])) {
              if (key[1]) {
                delete key[1].__typename
              }
            }
          })
          delete productCost.totalProductCost
          const product = {
            cost: productCost
          }
          const response = await updateProduct({
            variables: {
              id: match.params.id,
              product
            }
          })

          if (response && response.data && response.data.updateProduct) {
            refetchGetProduct()
            handleToggleActiveEdit('activeCostShow')
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
        }
        setSubmitting(false)
      },
      submitUpdateLogisticsHandler: (_, { refetchGetProduct, updateProduct, match, handleToggleActiveEdit }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          delete values.__typename
          const fieldsNeedToRemoveTypename = ['unit', 'packaged', 'innerCarton', 'exportCarton']
          Object.entries(values).forEach(key => {
            if (fieldsNeedToRemoveTypename.includes(key[0])) {
              if (key[1]) {
                delete key[1].__typename
              }
            }
          })
          const product = {
            logistics: values
          }
          if (product && product.logistics && product.logistics.origin && product.logistics.origin.common) product.logistics.origin = product.logistics.origin.common
          const response = await updateProduct({
            variables: {
              id: match.params.id,
              product
            }
          })
          if (response && response.data && response.data.updateProduct) {
            refetchGetProduct()
            handleToggleActiveEdit('activeLogisticsShow')
          }
        } catch (exception) {
          const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
          setErrors({
            form: msg
          })
          console.error(msg, exception)
        }
        setSubmitting(false)
      },
      submitUpdateUsersHandler: (_, { refetchGetProduct, updateProduct, match, handleToggleActiveEdit }) => async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true)
        try {
          const product = {
            users: values
          }
          const response = await updateProduct({
            variables: {
              id: match.params.id,
              product
            }
          })

          if (response && response.data && response.data.updateProduct) {
            refetchGetProduct()
            handleToggleActiveEdit('activeUsersShow')
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
  )
)(ProductDetail)
