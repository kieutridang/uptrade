import { Modal, TouchableOpacity, View, Text, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import { withState } from 'recompose'
import { compose } from 'react-apollo'
import { withFormik } from 'formik'
import { TextField } from 'react-native-material-textfield'
import { Dropdown } from 'react-native-material-dropdown'
import HardcodeList from '../../../../constants/HardcodeList'
import ModalSupplier from './modal/supplier.modal'
import * as Yup from 'yup'

const CreateCostModal = props => {
  const {
    closeModal, isSupplierOpen, openSupplierModal, isInCreateMode,
    handleChange, errors, values, setFieldValue, isSubmitting, handleSubmit,
    ...rest
  } = props
  return (
    <Modal {...rest} onRequestClose={() => {}}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: '#00b9ae',
            height: 60
          }}>
          <TouchableOpacity onPress={closeModal} style={{ position: 'absolute', right: 10, top: 20, borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 2, zIndex: 1 }}>
            <Icon name='close' color='white' />
          </TouchableOpacity>
          <Text style={{ marginTop: 20, marginLeft: 10, fontSize: 24, color: 'white', fontWeight: 'bold' }}>{ isInCreateMode ? 'Add Supplier' : 'Supplier' }</Text>
        </View>
        <ScrollView style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
          <Dropdown
            name='type'
            label='Type'
            error={errors['type']}
            data={HardcodeList.CostType}
            value={values.type}
            onChangeText={handleChange('type')}
          />
          <TouchableOpacity onPress={() => openSupplierModal(true)}>
            <TextField
              label='Supplier *'
              value={(values.supplier && values.supplier.name) || ''}
              editable={false}
            />
          </TouchableOpacity>
          <TextField
            name='MOQ'
            label='MOQ'
            error={errors['MOQ']}
            value={values.MOQ}
            handleTextChange={handleChange('MOQ')}
            ref={input => { this.MOQ = input }}
            onSubmitEditing={() => this.currency.focus()}
          />
          <Dropdown
            name='currency'
            label='Currency'
            error={errors['currency']}
            data={HardcodeList.Currencies}
            value={values.currency}
            onChangeText={handleChange('currency')}
            ref={input => { this.currency = input }}
            onSubmitEditing={() => this.cost.focus()}
          />
          <TextField
            name='cost'
            label='Cost'
            error={errors['cost']}
            value={values.cost}
            handleTextChange={handleChange('cost')}
            ref={input => { this.cost = input }}
          />

          { errors['form']
            ? <Text style={{ color: 'red' }}>{errors['form']}</Text>
            : null
          }

        </ScrollView>
      </View>
      <ModalSupplier visible={isSupplierOpen} closeModal={() => openSupplierModal(false)} onSelected={supplier => {
        setFieldValue('supplier', supplier)
      }} />
    </Modal>
  )
}

export default compose(
  withState('isSupplierOpen', 'openSupplierModal', false),
  withFormik({
    mapPropsToValues: () => ({
      type: 'SUPPLIER',
      supplier: '',
      MOQ: 'ACTIVE',
      currency: 'USD',
      cost: 0,
      updatedAt: new Date()
    }),
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      supplier: Yup.string().required('This field is mandatory')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
      // const { closeModal } = props
      setSubmitting(true)
    }
  })
)(CreateCostModal)
