import * as Yup from 'yup'
import APPCONFIG from '../../config/AppConfig'

const requiredFieldMessage = APPCONFIG.form.message.required

const userProfileValidationSchema = Yup.object().shape({
  accountType: Yup.string().required(requiredFieldMessage),
  email: Yup.string().required(requiredFieldMessage),
  firstName: Yup.string().required(requiredFieldMessage),
  lastName: Yup.string().required(requiredFieldMessage)
})

export { userProfileValidationSchema }
