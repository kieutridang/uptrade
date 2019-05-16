import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import { TextField } from 'react-native-material-textfield'

class AddSearchInline extends React.Component {
  render () {
    const { onAdd, onSearch } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name='add' reverse raised size={20} color='#ffffff' reverseColor='#00B9AE' onPress={onAdd} iconStyle={styles.icon} />
        </View>
        <View style={styles.searchContainer}>
          <TextField placeholder='Search...' label='Search' containerStyle={styles.textField} />
          <Icon name='search' size={20} color='#000' onSearch={onSearch} iconStyle={styles.icon} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 5,
    marginBottom: 5
  },
  icon: {
    width: 20
  },
  textField: {
    width: 150
  },
  iconContainer: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
})

export default AddSearchInline
