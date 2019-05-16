import * as Yup from 'yup'
import APPCONFIG from '../../config/AppConfig'

const requiredFieldMessage = APPCONFIG.form.message.required

const buyerAIValidationSchema = Yup.object().shape({
  item: Yup.string().required(requiredFieldMessage),
  concurrentList: Yup.string().required(requiredFieldMessage)
})

export { buyerAIValidationSchema }
