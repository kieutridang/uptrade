import React from 'react'
import { Icon, Text } from 'react-native-elements'
import { TouchableOpacity, Alert, Platform, Modal } from 'react-native'
import { compose, lifecycle, withState } from 'recompose'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { LocalAuthentication } from 'expo'
import store from 'react-native-simple-store'

const AuthOverlay = (props) => {
  const { isOverlayOpen, toggleOverlay, navigation, isAbleToUseFingerprint } = props

  return (
    <Modal
      animationType='slide'
      transparent={false}
      visible={isOverlayOpen}
      isVisible={isOverlayOpen}
      presentationStyle='fullScreen'
      onRequestClose={() => {}}
    >
      <TouchableOpacity
        onPress={() => toggleOverlay(!isOverlayOpen)}
        style={{
          position: 'absolute',
          right: 10,
          top: 30,
          backgroundColor: 'white',
          zIndex: 1
        }}>
        <Icon
          name='close'
          size={36}
          color='#666666'
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          await store.update('auth', {
            authMode: 'REMEMBER_ME'
          })
          toggleOverlay(false)
          navigation.navigate('Home')
        }}
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1
        }}>
        <FontAwesomeIcon name='key' size={48} style={{ marginBottom: 20 }} />
        <Text style={{ marginBottom: 20, color: '#3D8CFF' }}>Keep me logged in</Text>
        <Text>Go straight to my stuff</Text>
      </TouchableOpacity>
      { Platform.OS !== 'android'
        ? (
          <TouchableOpacity
            disabled={!isAbleToUseFingerprint}
            onPress={async () => {
              const scanFingerPrint = async () => {
                try {
                  const result = await LocalAuthentication.authenticateAsync('Scan your finger to login into this app')
                  if (result.success) {
                    await store.update('auth', {
                      authMode: 'TOUCH_ID'
                    })
                    navigation.navigate('Home')
                  } else {
                    if (result.error) {
                      Alert(result.error)
                    }
                    if (result.warning) {
                      Alert(result.warning)
                    }
                  }
                } catch (ex) {
                  // console.error(ex)
                }
              }

              if (Platform.OS === 'android') {
                Alert.alert(
                  'Fingerprint Scan',
                  'Place your finger over the touch sensor and press scan.',
                  [
                    {
                      text: 'Scan',
                      onPress: async () => {
                        await scanFingerPrint()
                      }
                    },
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel'),
                      style: 'cancel'
                    }
                  ]
                )
              } else {
                await scanFingerPrint()
              }
            }}
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomWidth: 1
            }}>
            <Icon name='fingerprint' size={48} containerStyle={{ marginBottom: 20 }} />
            <Text style={{ marginBottom: 20, color: '#3D8CFF' }}>Use Touch ID</Text>
            <Text>Recommend if others use your phone</Text>
          </TouchableOpacity>
        )
        : null}
      <TouchableOpacity
        onPress={async () => {
          await store.update('auth', {
            authMode: 'ALWAYS_ASK_FOR_EMAIL'
          })
          navigation.navigate('Home')
        }}
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 10
        }}>
        <FontAwesomeIcon name='keyboard-o' size={48} style={{ marginBottom: 20 }} />
        <Text style={{ marginBottom: 20, color: '#3D8CFF' }}>Always ask for Email</Text>
        <Text>Use if you do not have Touch ID feature</Text>
      </TouchableOpacity>
    </Modal>
  )
}

export default compose(
  withState('isAbleToUseFingerprint', 'setIsAbleToUseFingerprint', false),
  withState('fingerprints', 'setFingerprints', false),
  lifecycle({
    async componentDidMount () {
      const { setIsAbleToUseFingerprint, setFingerprints } = this.props
      const isAbleToUseFingerprint = await LocalAuthentication.hasHardwareAsync()
      const fingerprints = await LocalAuthentication.isEnrolledAsync()
      setIsAbleToUseFingerprint(isAbleToUseFingerprint)
      setFingerprints(fingerprints)
    }
  })
)(AuthOverlay)
