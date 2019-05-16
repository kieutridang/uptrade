import * as Yup from 'yup'
import APPCONFIG from '../../config/AppConfig'

const requiredFieldMessage = APPCONFIG.form.message.required

const eventValidationSchema = Yup.object().shape({
  name: Yup.string().required(requiredFieldMessage),
  startDate: Yup.string().required(requiredFieldMessage),
  endDate: Yup.string().required(requiredFieldMessage)
})

export { eventValidationSchema }
