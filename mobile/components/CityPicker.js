import React from 'react'
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Icon } from 'react-native-elements'
import { TextField } from 'react-native-material-textfield'
import { hoistStatics, withState } from 'recompose'
import { compose } from 'react-apollo'

class CityPicker extends React.Component {
  componentWillReceiveProps (prevProps) {
    const { country, setSearchValue, onChange } = this.props
    if (prevProps.country !== country) {
      onChange('')
      setSearchValue('')
    }
  }

  handleSelect = (city) => {
    const { onChange, setSearchValue, toggleSearching } = this.props
    onChange(city)
    toggleSearching(false)
    setSearchValue(city)
  }

  render () {
    const { getCityList, value, country, error, searchValue, setSearchValue, isSearching, toggleSearching, isConnected } = this.props
    let cityList = []
    if (isConnected) {
      cityList = getCityList.loading ? [] : (getCityList.country.cityList)
      cityList = cityList.filter(val => val.toLowerCase().startsWith(searchValue.toLowerCase()))
    }
    return (
      <View>
        <TextField
          name='city'
          label='Event city'
          value={isSearching ? searchValue : value}
          error={error}
          onFocus={() => toggleSearching(true)}
          onChangeText={(text) => {
            if (isConnected) {
              setSearchValue(text)
              if (text.length >= 2) {
                getCityList.refetch({ name: country, filter: text })
              }
            } else {
              this.handleSelect(text)
            }
          }}
        />
        {
          isConnected && isSearching &&
          (<ScrollView style={styles.itemContainer}>
            {getCityList.loading && <ActivityIndicator size='small' />}
            {(searchValue.length >= 2) &&
              cityList.map((city) => {
                let listItemStyle = styles.listItem
                if (value === city) {
                  listItemStyle = {
                    ...listItemStyle,
                    ...styles.selectedItem
                  }
                }
                return (
                  <TouchableOpacity onPress={() => this.handleSelect(city)} key={city} style={listItemStyle}>
                    <Text style={{ flex: 1 }}>{city}</Text>
                    {(value === city) && <Icon name='check' size={24} color='#00b9ae' />}
                  </TouchableOpacity>
                )
              })
            }
            {
              (!getCityList.loading && !cityList.length && searchValue.length >= 2) && <Text style={styles.infoText}>No city found</Text>
            }
            {
              !(searchValue.length >= 2) && <Text style={styles.infoText}>Input at least 2 characters</Text>
            }
          </ScrollView>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    height: 'auto',
    minHeight: 20,
    maxHeight: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.20)',
    flexDirection: 'row',
    alignContent: 'space-between',
    alignItems: 'center'
  },
  selectedItem: {
    color: '#00b9ae',
    backgroundColor: 'rgba(0, 185, 174, 0.1)'
  },
  infoText: {
    color: 'red',
    fontSize: 10
  }
})

const enhance = compose(
  withState('isSearching', 'toggleSearching', false),
  withState('searchValue', 'setSearchValue', '')
)

export default hoistStatics(enhance)(CityPicker)
