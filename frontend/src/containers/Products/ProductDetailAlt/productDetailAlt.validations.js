import * as Yup from 'yup'
import APPCONFIG from '../../../config/AppConfig'

const requiredFieldMessage = APPCONFIG.form.message.required

const productLightCreateValidationSchema = Yup.object().shape({
  // itemStatus: Yup.string().required(requiredFieldMessage),
  category: Yup.string(),
  // subCategory: Yup.string().required(requiredFieldMessage),
  // brand: Yup.string().required(requiredFieldMessage),
  essentialsItemNumber: Yup.string(),
  itemName: Yup.string().required(requiredFieldMessage),
  // MOQ: Yup.string().required(requiredFieldMessage),
  // testCertificate: Yup.boolean().required(requiredFieldMessage),
  // formAE: Yup.string().required(requiredFieldMessage),
  // leadTime: Yup.string().required(requiredFieldMessage),
  sampleCost: Yup.number()
  // sampleLeadTime: Yup.string().required(requiredFieldMessage),
  // : Yup.string().required(requiredFieldMessage),

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
const productSheetValidationSchema = Yup.object().shape({
  // cost: Yup.object().shape({
  //   productsCost: Yup.array()
  //     .of(
  //       Yup.object().shape({
  //         supplier: Yup.string().required(requiredFieldMessage),
  //         quantity: Yup.string().required(requiredFieldMessage),
  //         cost: Yup.string().required(requiredFieldMessage),
  //         currency: Yup.string().required(requiredFieldMessage)

  //       })
  //     )
  //     .required('Must have products')
  //     .min(1, 'Minimum of 1 supllier')
  // }),
  // marketPlacePrice: Yup.object().shape({
  //   cost: Yup.string().required(requiredFieldMessage),
  //   currency: Yup.string().required(requiredFieldMessage)
  // }),
  // logistics: Yup.object().shape({
  //   port: Yup.string().required(requiredFieldMessage),
  //   origin: Yup.string().required(requiredFieldMessage),
  //   incoterm: Yup.string().required(requiredFieldMessage),
  //   unit: Yup.object().shape({
  //     units: Yup.string().required(requiredFieldMessage),
  //     l: Yup.string().required(requiredFieldMessage),
  //     h: Yup.string().required(requiredFieldMessage),
  //     w: Yup.string().required(requiredFieldMessage)
  //   }),
  //   exportCarton: Yup.object().shape({
  //     volume: Yup.string().required(requiredFieldMessage)
  //   })
  // }),
  // essentials: Yup.object().shape({
  //   leadTime: Yup.string().required(requiredFieldMessage),
  //   sampleCost: Yup.string().required(requiredFieldMessage),
  //   sampleLeadTime: Yup.string().required(requiredFieldMessage),
  //   testCertificate: Yup.string().required(requiredFieldMessage),
  //   MOQ: Yup.string().required(requiredFieldMessage)
  // })
})

export { productSheetValidationSchema, productLightCreateValidationSchema }
