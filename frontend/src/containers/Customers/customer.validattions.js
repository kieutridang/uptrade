import * as Yup from 'yup'
import APPCONFIG from '../../config/AppConfig'

const requiredFieldMessage = APPCONFIG.form.message.required

const customerCreateValidationSchema = (openCreateCustomerMode) => {
  if (openCreateCustomerMode) {
    return Yup.object().shape({
      uptradeID: Yup.string().required(requiredFieldMessage),
      name: Yup.string(),
      fullName: Yup.string(),
      contactPhone: Yup.string(),
      email: Yup.string(),
      firstName: Yup.string(),
      lastName: Yup.string()
    })
  }
  return Yup.object().shape({
    uptradeID: Yup.string().required(requiredFieldMessage)
  })
}

export {
  customerCreateValidationSchema
}
