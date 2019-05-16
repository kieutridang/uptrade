import * as Yup from 'yup'
import APPCONFIG from '../../config/AppConfig'

const requiredFieldMessage = APPCONFIG.form.message.required

const essentialsValidationSchema = Yup.object().shape({
  itemStatus: Yup.string().required(requiredFieldMessage),
  category: Yup.string().required(requiredFieldMessage),
  // subCategory: Yup.string().required(requiredFieldMessage),
  // brand: Yup.string().required(requiredFieldMessage),
  itemNumber: Yup.string().required(requiredFieldMessage),
  itemName: Yup.string().required(requiredFieldMessage),
  // MOQ: Yup.string().required(requiredFieldMessage),
  // testCertificate: Yup.string().required(requiredFieldMessage),
  // formAE: Yup.string().required(requiredFieldMessage),
  // leadTime: Yup.string().required(requiredFieldMessage),
  sampleCost: Yup.number().required(requiredFieldMessage)
  // sampleLeadTime: Yup.string().required(requiredFieldMessage)
})
const supplierValidationSchema = Yup.object().shape({
  supplier: Yup.array()
    .of(
      Yup.object().shape({
        itemNumber: Yup.string().required(requiredFieldMessage),
        name: Yup.string().required(requiredFieldMessage),
        status: Yup.string().required(requiredFieldMessage),
        factorySubcontractor: Yup.string().required(requiredFieldMessage),
        contactName: Yup.string().required(requiredFieldMessage),
        contact: Yup.string().required(requiredFieldMessage)
      })
    )
    .required('Must have suplliers') // these constraints are shown if and only if inner constraints are satisfied
    .min(1, 'Minimum of 1 supllier')
})
const descriptionvalidationSchema = Yup.object().shape({
  color: Yup.string().required(requiredFieldMessage),
  customerItemNumber: Yup.string().required(requiredFieldMessage),
  exclusivity: Yup.string().required(requiredFieldMessage),
  shortDescription: Yup.string().required(requiredFieldMessage),
  longDescription: Yup.string().required(requiredFieldMessage),
  composition: Yup.string().required(requiredFieldMessage),
  internalRemark: Yup.string().required(requiredFieldMessage),
  marketPlaceDescription: Yup.string().required(requiredFieldMessage)
})
const costValdiationSchema = Yup.object().shape({
  cost: Yup.array()
    .of(
      Yup.object().shape({
        type: Yup.string().required(requiredFieldMessage),
        supplier: Yup.string().required(requiredFieldMessage),
        quantity: Yup.string().required(requiredFieldMessage),
        currency: Yup.string().required(requiredFieldMessage),
        cost: Yup.string().required(requiredFieldMessage),
        update: Yup.string().required(requiredFieldMessage)
      })
    )
    .required('Must have suplliers') // these constraints are shown if and only if inner constraints are satisfied
    .min(1, 'Minimum of 1 supllier')
})

const logisticsValidationSchema = Yup.object().shape({
  incoterm: Yup.string().required(requiredFieldMessage),
  origin: Yup.string().required(requiredFieldMessage),
  port: Yup.string().required(requiredFieldMessage),
  hsCode: Yup.string().required(requiredFieldMessage)
})

const usersValdiationSchema = Yup.object().shape({
  users: Yup.array()
    .of(
      Yup.object().shape({
        _id: Yup.string().required(requiredFieldMessage)
      })
    )
    .required('Must have users') // these constraints are shown if and only if inner constraints are satisfied
    .min(1, 'Minimum of 1 user')
})

const productValidationSchema = Yup.object().shape({
  itemStatus: Yup.string().required(requiredFieldMessage),
  category: Yup.string(),
  // subCategory: Yup.string().required(requiredFieldMessage),
  // brand: Yup.string().required(requiredFieldMessage),
  essentialsItemNumber: Yup.string(),
  itemName: Yup.string().required(requiredFieldMessage),
  // MOQ: Yup.string().required(requiredFieldMessage),
  // testCertificate: Yup.boolean().required(requiredFieldMessage),
  // formAE: Yup.string().required(requiredFieldMessage),
  // leadTime: Yup.string().required(requiredFieldMessage),
  sampleCost: Yup.string().required(requiredFieldMessage)
  // sampleLeadTime: Yup.string().required(requiredFieldMessage),
  // imageUrl: Yup.string().required(requiredFieldMessage),

  // supplierItemNumber: Yup.string().required(requiredFieldMessage),
  // name: Yup.string().required(requiredFieldMessage),
  // status: Yup.string().required(requiredFieldMessage),
  // factorySubcontractor: Yup.string().required(requiredFieldMessage),
  // contactName: Yup.string().required(requiredFieldMessage),
  // contact: Yup.string().required(requiredFieldMessage),

  // color: Yup.string().required(requiredFieldMessage),
  // customerItemNumber: Yup.string().required(requiredFieldMessage),
  // exclusivity: Yup.string().required(requiredFieldMessage),
  // shortDescription: Yup.string().required(requiredFieldMessage),
  // longDescription: Yup.string().required(requiredFieldMessage),
  // composition: Yup.string().required(requiredFieldMessage),
  // internalRemark: Yup.string().required(requiredFieldMessage),
  // marketPlaceDescription: Yup.string().required(requiredFieldMessage),

  // productManager: Yup.string().required(requiredFieldMessage),
  // procurementManager: Yup.string().required(requiredFieldMessage),
  // qualityManager: Yup.string().required(requiredFieldMessage),
  // marketingmanager: Yup.string().required(requiredFieldMessage)
})

export {
  essentialsValidationSchema,
  supplierValidationSchema,
  descriptionvalidationSchema,
  costValdiationSchema,
  logisticsValidationSchema,
  usersValdiationSchema,
  productValidationSchema
}
