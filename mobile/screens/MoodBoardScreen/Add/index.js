import React from 'react'
import { ScrollView } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import SinglePhotoPicker from '../../../components/SinglePhotoPicker'
import { TextField } from 'react-native-material-textfield'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import { compose, graphql } from 'react-apollo'
import { hoistStatics } from 'recompose'
import gql from 'graphql-tag'
import DropdownHolder from '../../../utils/dropdownHolder'

const CREATE_MOOD_BOARD = gql`
  mutation($imageUrl: String, $caption: String, $width: Int, $height: Int) {
    createMoodBoard(imageUrl: $imageUrl, caption: $caption, width: $width, height: $height) {
      userId
      imageUrl
      caption
    }
  }
`

class AddMoodboard extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: { color: '#fff' },
      title: 'New Card',
      headerLeft: <Icon name='arrow-back' size={24} color='#fff' onPress={() => navigation.goBack()} />
    }
  };

  render () {
    const { errors, values, setFieldValue, isSubmitting, handleSubmit } = this.props
    return (
      <ScrollView style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
        <SinglePhotoPicker
          name='imageUrl'
          onChange={(imagePath, width, height) => {
            setFieldValue('imageUrl', imagePath)
            setFieldValue('width', width)
            setFieldValue('height', height)
          }}
          error={errors['imageUrl']}
          placeholder='Moodboard Photo *'
        />
        <TextField
          name='caption'
          label='Caption'
          error={errors['caption']}
          value={values.caption}
          onChangeText={
            (caption) => {
              setFieldValue('caption', caption)
            }
          }
        />
        <Button
          title='Add'
          loading={isSubmitting}
          loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
          buttonStyle={{
            marginTop: 20,
            marginBottom: 20,
            elevation: 0
          }}
          onPress={handleSubmit}
        />
      </ScrollView>
    )
  }
}

const enhance = compose(
  graphql(CREATE_MOOD_BOARD, {
    name: 'createMoodBoard',
    options: {
      refetchQueries: ['ListMoodBoards']
    }
  }),
  withFormik({
    mapPropsToValues: () => ({
      imageUrl: '',
      caption: ''
    }),
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      imageUrl: Yup.string().required('Image is required')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
      const { createMoodBoard, navigation } = props
      setSubmitting(true)

      try {
        await createMoodBoard({
          variables: values
        })
        DropdownHolder.alert('success', 'Create moodboard success', `New moodboard with photo have added to moodboard list`)
        navigation.navigate('MoodBoards')
      } catch (exception) {
        const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : exception.message
        if (msg) {
          setErrors({
            form: msg
          })
          console.warn(msg)
        } else {
          console.error(exception)
        }
      }
      setSubmitting(false)
    }
  })
)

export default hoistStatics(enhance)(AddMoodboard)
