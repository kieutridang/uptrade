import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import TabBarIcon from '../components/TabBarIcon'

import ProductScreen from '../screens/ProductScreen'
import AddProductScreen from '../screens/ProductScreen/Add'
import EditProductScreen from '../screens/ProductScreen/Edit'
import ProductSettingScreen from '../screens/ProductScreen/Setting'

import MoodBoardScreen from '../screens/MoodBoardScreen'
import NewMoodboardScreen from '../screens/MoodBoardScreen/Add/index'
import UpdateMoodboardScreen from '../screens/MoodBoardScreen/Edit/index'

import ChatScreen from '../screens/ChatScreen'

import EventScreen from '../screens/EventScreen'
import AddEventScreen from '../screens/EventScreen/Add'
import EventSettings from '../screens/EventScreen/Settings/index'
import ProductsEvent from '../screens/EventScreen/ProductScreen'
import AddProductEvent from '../screens/EventScreen/ProductScreen/Add'
import EditProductEvent from '../screens/EventScreen/ProductScreen/Edit'
import ProductEventSetting from '../screens/EventScreen/ProductScreen/Setting/index'
import CompanyParticipants from '../screens/EventScreen/Settings/components/CompanyPariticipants'
import AddUserForm from '../screens/EventScreen/Settings/components/AddUserForm'
import AddCompanyForm from '../screens/EventScreen/Settings/components/AddCompanyForm'

import CreateProductSetting from '../screens/CreateProductSettingScreen/index'
import Settings from '../screens/SettingScreen/index'
import UserScreen from '../screens/UserScreen'
import AddUserScreen from '../screens/UserScreen/Add'

const ProductStack = createStackNavigator({
  Product: ProductScreen,
  AddProduct: AddProductScreen,
  EditProduct: EditProductScreen,
  ProductSetting: ProductSettingScreen
})

ProductStack.navigationOptions = {
  tabBarLabel: 'Products',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-archive`
          : 'md-archive'
      }
    />
  )
}

const SettingStack = createStackNavigator({
  Settings: Settings,
  User: UserScreen,
  AddUser: AddUserScreen,
  CreateProductSetting: CreateProductSetting
})

SettingStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-settings`
          : 'md-settings'
      }
    />
  )
}

const MoodBoardStack = createStackNavigator({
  MoodBoards: MoodBoardScreen,
  NewMoodboard: NewMoodboardScreen,
  UpdateMoodboard: UpdateMoodboardScreen
})

MoodBoardStack.navigationOptions = {
  tabBarLabel: 'Moodboards',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios'
        ? `ios-camera`
        : 'md-camera'}
    />
  )
}

const ChatsStack = createStackNavigator({
  Chat: ChatScreen
})

ChatsStack.navigationOptions = {
  tabBarLabel: 'Chat',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios'
        ? `ios-chatbubbles`
        : 'md-chatbubbles'}
    />
  )
}

const EventsStack = createStackNavigator({
  Event: EventScreen,
  AddEvent: AddEventScreen,
  EventSetting: {
    screen: EventSettings,
    path: '/settings/:eventId'
  },
  ProductsEvent: ProductsEvent,
  AddProductEvent: AddProductEvent,
  EditProductEvent: EditProductEvent,
  ProductEventSetting: ProductEventSetting,
  CompanyParticipants: CompanyParticipants,
  EventAddUsers: AddUserForm,
  EventAddCompanies: AddCompanyForm
})

EventsStack.navigationOptions = {
  tabBarLabel: 'Events',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios'
        ? `ios-calendar`
        : 'md-calendar'}
    />
  )
}

const UsersStack = createStackNavigator({
  User: UserScreen,
  AddUser: AddUserScreen
})

UsersStack.navigationOptions = {
  tabBarLabel: 'Users',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios'
        ? `ios-contact`
        : 'md-contact'}
    />
  )
}

export default createBottomTabNavigator({
  ProductStack,
  // UsersStack,
  EventsStack: {
    screen: EventsStack,
    path: 'event'
  },
  // MoodBoardStack,
  // ChatsStack,
  SettingStack
}, {
  tabBarOptions: {
    labelStyle: {
      fontSize: 10,
      fontWeight: 'bold'
    }
  }
})
