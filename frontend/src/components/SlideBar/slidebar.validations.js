import * as Yup from 'yup'
import APPCONFIG from '../../config/AppConfig'

const requiredFieldMessage = APPCONFIG.form.message.required

const topicValidationSchema = Yup.object().shape({
  user: Yup.string().required(requiredFieldMessage),
  productId: Yup.string().required(requiredFieldMessage),
  title: Yup.string().required(requiredFieldMessage),
  message: Yup.string().required(requiredFieldMessage)
})

export {
  topicValidationSchema
}
