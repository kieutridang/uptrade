import React from 'react'
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation'

import MainTabNavigator from './MainTabNavigator'
import SignInScreen from '../screens/SignInScreen'
import AuthLoadingScreen from '../screens/AuthLoadingScreen'
import SignUpScreen from '../screens/SignUpScreen'
import ResetPasswordScreen from '../screens/ResetPasswordScreen'
import Sidebar from '../components/Sidebar'
import SetupPasswordScreen from '../screens/SetupPasswordScreen'
import ConfirmResetPasswordScreen from '../screens/ConfirmResetPasswordScreen'

const AppStack = createDrawerNavigator({
  Home: {
    screen: MainTabNavigator,
    path: 'home'
  }
}, { headerMode: 'none', contentComponent: props => <Sidebar {...props} /> })

const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignInScreen,
    path: 'login'
  },
  SignUp: SignUpScreen,
  ResetPassword: {
    screen: ResetPasswordScreen
  },
  SetupPassword: {
    screen: SetupPasswordScreen,
    path: 'setup-password'
  },
  ConfirmResetPassword: {
    screen: ConfirmResetPasswordScreen,
    path: 'reset-password'
  }
}, { headerMode: 'none' })

const NavigationContainer = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: {
      screen: AppStack,
      path: 'app'
    },
    Auth: {
      screen: AuthStack,
      path: 'user'
    }
  },
  {
    initialRouteName: 'AuthLoading'
  }
))

export default NavigationContainer
