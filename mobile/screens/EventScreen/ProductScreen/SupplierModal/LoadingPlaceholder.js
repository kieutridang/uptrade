import { View } from 'react-native'
import Placeholder from 'rn-placeholder'

const LoadingPlaceholder = ({ isReady, children }) => {
  var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  if (isReady) {
    return children
  }
  return arr.map((item, index) => {
    return (
      <View key={item + index} style={{ marginTop: 5, padding: 5 }}>
        <Placeholder.Line
          textSize={14}
          width='100%'
          color='#cccccc'
        />
      </View>
    )
  })
}

export default LoadingPlaceholder
