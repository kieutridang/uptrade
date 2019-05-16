import React from 'react'
import { View, Text, Switch } from 'react-native'

const ToggleInput = props => {
  const { label, style } = props
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: '#86939e', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: 10, ...style }}>
      <Text style={{ flex: 1, fontSize: 16, color: '#86939e', fontWeight: 'bold' }}>{label}</Text>
      <Switch />
    </View>
  )
}

export default ToggleInput
