import React from 'react'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { Icon, ListItem } from 'react-native-elements'
import ActionButton from 'react-native-action-button'

import LoadingPlaceholder from './LoadingPlaceholder'

class SelectSuppliers extends React.Component {
  checkAndUncheckSupplier = (item) => {
    const { supplierList, editSupplierList } = this.props
    let tempList = supplierList.map(element => {
      if (element._id === item._id) {
        return {
          _id: element._id,
          data: element.data,
          isChecked: !element.isChecked
        }
      } else {
        return {
          _id: element._id,
          data: element.data,
          isChecked: element.isChecked
        }
      }
    })
    editSupplierList(tempList)
  }

  saveSupplierList = () => {
    const { onSelected, supplierList, closeModal } = this.props
    onSelected(supplierList.filter(element => {
      return element.isChecked
    }).map(element => element.data))
    closeModal()
  }

  render () {
    const {
      closeModal,
      supplierList,
      setInCreateMode, isInCreateMode,
      querySuppliers
    } = this.props

    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#00b9ae', height: 92, paddingTop: 32 }}>
          <View style={{ position: 'absolute', right: 10, top: 52, zIndex: 2, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => this.saveSupplierList(this.props)} style={{ borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 2, marginRight: 8 }}>
              <Icon name='save' color='white' />
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={{ borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 2 }}>
              <Icon name='close' color='white' />
            </TouchableOpacity>
          </View>
          <Text style={{ marginTop: 20, marginLeft: 10, fontSize: 24, color: 'white', fontWeight: 'bold' }}>Supplier</Text>
        </View>

        <LoadingPlaceholder isReady={querySuppliers.loading === false || (supplierList && supplierList.length)}>
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={supplierList || []}
            renderItem={({ item }) => <ListItem
              onPress={() => {
                this.checkAndUncheckSupplier(item)
              }}
              title={item.data._company && item.data._company.about && item.data._company.about.name}
              titleStyle={{ fontWeight: 'bold' }}
              containerStyle={{
                borderBottomWidth: 1,
                borderColor: '#cccccc'
              }}
              checkBox={{
                checked: item.isChecked,
                onPress: () => {
                  this.checkAndUncheckSupplier(item)
                }
              }}
            />}
            keyExtractor={(item, i) => item._id + i}
            ListEmptyComponent={<View><Text>Empty Supplier</Text></View>}
            onEndReached={() => {
              if (querySuppliers.suppliers && querySuppliers.suppliers.hasNextPage) {
                querySuppliers.fetchMore({
                  variables: {
                    page: querySuppliers.suppliers.nextPageCursor
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev

                    let result = Object.assign({}, prev, fetchMoreResult)
                    result.suppliers.suppliers = [...prev.suppliers.suppliers, ...fetchMoreResult.suppliers.suppliers]

                    return result
                  }
                })
              }
            }}
            onEndThreshold={200}
            ListFooterComponent={() => {
              return (
                querySuppliers.suppliers && querySuppliers.suppliers.hasNextPage
                  ? (
                    <View style={{ padding: 10 }}>
                      <ActivityIndicator size='small' color='#0000ff' />
                    </View>
                  )
                  : null
              )
            }}
          />
        </LoadingPlaceholder>

        <ActionButton
          renderIcon={() => {
            if (isInCreateMode) {
              return <Icon name='close' color='white' />
            }
            return <Icon name='add' color='white' />
          }}
          buttonColor='rgba(231,76,60,1)'
          onPress={() => { setInCreateMode(!isInCreateMode) }}
        />
      </View>
    )
  }
}

export default SelectSuppliers
