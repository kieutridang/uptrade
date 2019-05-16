import React from 'react'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { TouchableOpacity, Image, ActivityIndicator, Dimensions, View, Text } from 'react-native'
import constants from '../constants/Config'
import { ImagePicker, Permissions, ImageManipulator } from 'expo'
import { withHandlers, withState, lifecycle, compose } from 'recompose'
import { Button, Icon } from 'react-native-elements'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import ImageView from 'react-native-image-view'
import _ from 'lodash'

const sliderWidth = Dimensions.get('window').width

class MultiplePhotoPicker extends React.Component {
  handleSaveImages = (newImages) => {
    const { setImageFiles } = this.props
    setImageFiles(newImages)
  }

  pagination = () => {
    const { imageFiles, activeSlide } = this.props
    return (
      <Pagination
        dotsLength={imageFiles ? imageFiles.length + 1 : 0}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
        dotStyle={{
          width: 20,
          height: 20,
          borderRadius: 100,
          marginHorizontal: 6,
          backgroundColor: 'rgba(0, 0, 0, 0.95)'
        }}
        inactiveDotStyle={{
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
  }

  photoCarousel = () => {
    const { imageFiles, pickImage, setImageFiles, onChange, setActiveSlide, isImageViewVisible, changeImageView } = this.props
    if (imageFiles && imageFiles.length === 0) {
      return (
        <View style={{ position: 'relative', flex: 1, backgroundColor: '#dddddd', borderWidth: 1, justifyContent: 'center', width: '100%', height: 200 }}>
          <TouchableOpacity onPress={pickImage} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image resizeMode='cover' style={{ width: 120, height: 120 }} source={require('../assets/images/upload_placeholder.png')} />
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginBottom: 20 }}>Upload your photo</Text>
        </View>
      )
    }
    let viewModeImageList = (imageFiles && imageFiles.length !== 0 && imageFiles.map(imageUrl => {
      return {
        source: {
          uri: ((imageUrl && ((imageUrl.includes('http') === false && imageUrl.includes('file://') === false && `${constants.GRAPHQL_ENDPOINT}${imageUrl}`) || `${imageUrl}`)) || '')
        }
      }
    })) || []
    return (
      <View style={{ height: 320 }}>
        <ImageView
          images={viewModeImageList}
          isVisible={isImageViewVisible}
          onClose={() => changeImageView(false)}
        />
        <Carousel
          layout='default'
          removeClippedSubviews={false}
          data={[null, ...imageFiles]}
          onSnapToItem={(index) => setActiveSlide(index)}
          renderItem={({ item: imageUrl }) => {
            if (imageUrl === null) {
              return (
                <View style={{ position: 'relative', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.90)', justifyContent: 'center', width: '100%', height: 200 }}>
                  <TouchableOpacity onPress={pickImage} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon size={60} name='add' color='white' />
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginBottom: 20, color: 'white' }}>Upload more photos</Text>
                  </TouchableOpacity>
                </View>
              )
            }
            let imageURI = `${imageUrl}`
            if (imageURI.includes('http') === false && imageURI.includes('file://') === false) {
              imageURI = `${constants.GRAPHQL_ENDPOINT}${imageUrl}`
            }
            return (
              <View style={{ position: 'relative', flex: 1, height: 200, width: '100%' }}>
                <TouchableOpacity onPress={() => changeImageView(true)}>
                  <Image resizeMode='cover' style={{ height: 200, width: '100%' }} source={imageUrl ? { uri: imageURI } : require('../assets/images/upload_placeholder.png')} />
                </TouchableOpacity>
                <Button
                  title='Delete photo'
                  loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
                  buttonStyle={{
                    elevation: 0
                  }}
                  onPress={() => {
                    const remainingImages = imageFiles.filter(img => img !== imageUrl)
                    setImageFiles(remainingImages)
                    onChange && onChange(remainingImages)
                  }}
                />
              </View>
            )
          }}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth - 20}
        />
        {this.pagination()}
      </View>
    )
  }

  render () {
    const { uploading } = this.props
    return (
      <View style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {uploading
          ? (
            <ActivityIndicator size='large' color='#0000ff' />
          )
          : (
            this.photoCarousel()
          )
        }
      </View>
    )
  }
}

export default compose(
  connectActionSheet,
  withState('imageFiles', 'setImageFiles', props => props.value || []),
  withState('isImageViewVisible', 'changeImageView', false),
  withState('uploading', 'setUploading', false),
  withState('activeSlide', 'setActiveSlide', 0),
  withHandlers(() => {
    return {
      handleImagePicked: props => pickerResult => {
        const { setUploading, setImageFiles, imageFiles, onChange } = props
        setUploading(true)
        if (pickerResult.cancelled === false) {
          ImageManipulator.manipulateAsync(pickerResult.uri, [{ resize: { width: 480 } }], {
            compress: 0.8,
            format: 'jpeg'
          }).then(imageResult => {
            const result = [...imageFiles, imageResult.uri]
            setImageFiles(result)
            onChange && onChange(result)
          })
        }
        setUploading(false)
      }
    }
  }),
  withHandlers({
    pickImage: props => async value => {
      const { handleImagePicked, showActionSheetWithOptions } = props

      let options = ['Take Photo', 'Choose image from gallery', 'Cancel']

      showActionSheetWithOptions({
        options
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0: {
            const {
              status: cameraPerm
            } = await Permissions.askAsync(Permissions.CAMERA)

            const {
              status: cameraRollPerm
            } = await Permissions.askAsync(Permissions.CAMERA_ROLL)

            // only if user allows permission to camera AND camera roll
            if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
              let pickerResult = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                aspect: [4, 4]
              })

              handleImagePicked(pickerResult)
            }
            break
          }
          case 1: {
            const {
              status: cameraRollPerm
            } = await Permissions.askAsync(Permissions.CAMERA_ROLL)

            // only if user allows permission to camera roll
            if (cameraRollPerm === 'granted') {
              let pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: false,
                aspect: [4, 4]
              })

              handleImagePicked(pickerResult)
            }
            break
          }
          case 2: {
            break
          }
        }
      })
    }
  }),
  lifecycle({
    componentWillUpdate (nextProps) {
      if (_.isEqual(this.props.value, nextProps.value) === false && nextProps.value) {
        this.props.setImageFiles(nextProps.value)
      }
    }
  })
)(MultiplePhotoPicker)
