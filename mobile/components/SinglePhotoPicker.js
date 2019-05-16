import React from 'react'
import { TouchableOpacity, Image, ActivityIndicator, View, Text } from 'react-native'
import constants from '../constants/Config'
import { ImagePicker, Permissions, ImageManipulator } from 'expo'
import { compose, graphql } from 'react-apollo'
import { withHandlers, withState } from 'recompose'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import { Icon } from 'react-native-elements'
import gql from 'graphql-tag'

const FILE_UPLOAD_MUTATION = gql`
mutation($file: Upload!) {
  singleUpload(file: $file) {
    id
    path
    filename
    mimetype
    encoding
  }
}
`

const SinglePhotoPicker = (props) => {
  const { pickImage, uploading, imageFile, placeholder, error } = props
  let photoPicker = null
  let imageURI = `${imageFile}`
  if (imageURI.includes('http') === false && imageURI.includes('file://') === false) {
    imageURI = `${constants.GRAPHQL_ENDPOINT}${imageFile}`
  }
  if (imageFile) {
    photoPicker = (
      <TouchableOpacity
        onPress={pickImage}
        style={{ position: 'relative', flex: 1, width: '100%', marginTop: 20 }}>
        <Image resizeMode='cover' style={{ width: '100%', height: 200 }} source={{ uri: imageURI }} />
      </TouchableOpacity>
    )
  } else {
    photoPicker = (
      <TouchableOpacity
        onPress={pickImage}
        style={{ borderColor: error ? 'red' : 'black', position: 'relative', flex: 1, borderStyle: 'dashed', borderWidth: 1, justifyContent: 'center', width: '100%', padding: 50, marginTop: 20 }}>
        <Icon size={60} name='camera' />
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{placeholder || 'Upload Photo' }</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      { uploading
        ? (
          <ActivityIndicator size='large' color='#0000ff' />
        )
        : photoPicker
      }
      {
        error
          ? (
            <Text style={{ color: 'red' }}>{error}</Text>
          )
          : null
      }
    </View>
  )
}

export default compose(
  connectActionSheet,
  graphql(FILE_UPLOAD_MUTATION, { name: 'fileUpload' }),
  withState('imageFile', 'setImageFile', props => props.value || null),
  withState('uploading', 'setUploading', false),
  withHandlers(() => {
    return {
      handleImagePicked: props => pickerResult => {
        const { setUploading, setImageFile, onChange } = props
        if (!pickerResult.cancelled) {
          setUploading(true)
          ImageManipulator.manipulateAsync(pickerResult.uri, [{ resize: { width: 480 } }], {
            compress: 0.8,
            format: 'jpeg'
          }).then(imageResult => {
            setImageFile(imageResult.uri)
            onChange && onChange(imageResult.uri)
          })
        }
        setUploading(false)
      }
    }
  }),
  withHandlers({
    pickImage: props => async () => {
      const { handleImagePicked } = props

      const {
        status: cameraPerm
      } = await Permissions.askAsync(Permissions.CAMERA)

      const {
        status: cameraRollPerm
      } = await Permissions.askAsync(Permissions.CAMERA_ROLL)

      // only if user allows permission to camera AND camera roll
      if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
        let pickerResult = await ImagePicker.launchCameraAsync({
          allowsEditing: false
        })

        handleImagePicked(pickerResult)
      }
      // let options = ['Take Photo', 'Choose image from gallery', 'Cancel']

      // showActionSheetWithOptions({
      //   options
      // },
      // async (buttonIndex) => {
      //   switch (buttonIndex) {
      //     case 0: {
      //       const {
      //         status: cameraPerm
      //       } = await Permissions.askAsync(Permissions.CAMERA)

      //       const {
      //         status: cameraRollPerm
      //       } = await Permissions.askAsync(Permissions.CAMERA_ROLL)

      //       // only if user allows permission to camera AND camera roll
      //       if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      //         let pickerResult = await ImagePicker.launchCameraAsync({
      //           allowsEditing: false
      //         })

      //         handleImagePicked(pickerResult)
      //       }
      //       break
      //     }
      //     case 1: {
      //       const {
      //         status: cameraRollPerm
      //       } = await Permissions.askAsync(Permissions.CAMERA_ROLL)

      //       // only if user allows permission to camera roll
      //       if (cameraRollPerm === 'granted') {
      //         let pickerResult = await ImagePicker.launchImageLibraryAsync({
      //           allowsEditing: false
      //         })

      //         handleImagePicked(pickerResult)
      //       }
      //       break
      //     }
      //     case 2: {
      //       break
      //     }
      //   }
      // })
    }
  })
)(SinglePhotoPicker)
