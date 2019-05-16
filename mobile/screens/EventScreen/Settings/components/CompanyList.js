import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ListItem } from 'react-native-elements'

class CompanyList extends React.Component {
  constructor () {
    super()
    this.state = {

    }
  }
  removeDuplicate (array) {
    let newArray = []
    array.forEach(item => {
      if (!newArray.find(val => val.companyId === item.companyId)) {
        newArray.push(item)
      }
    })
    return newArray
  }
  handleChooseToggle = cardID => {
    const { handleChooseToggle } = this.props
    this.setState({
      [`cardActive_${cardID}`]: !this.state[`cardActive_${cardID}`]
    })
    handleChooseToggle(cardID)
  }
  render () {
    const { title, activeCards } = this.props
    const dataList = this.removeDuplicate(this.props.dataList)
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {
          dataList && dataList.map((company) => {
            const { about } = company._company
            let cardStyle = activeCards[`cardActive_${company.companyId}`] ? styles.cardActive : styles.cardInactive
            return (
              <ListItem
                key={`card${title}_${company.companyId}`}
                leftAvatar={{ source: { uri: about.logo || 'https://placeimg.com/640/480/any' } }}
                title={about.name}
                onPress={() => this.handleChooseToggle(company.companyId)}
                containerStyle={{ ...cardStyle }}
              />

            )
          })
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5
  },
  cardActive: {
    borderColor: '#00B9AE',
    borderWidth: 1,
    marginBottom: 5
  },
  cardInactive: {
    borderColor: '#ffffff',
    borderWidth: 1,
    marginBottom: 5
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18
  }
})

export default CompanyList
