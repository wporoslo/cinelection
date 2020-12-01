import 'react-native-gesture-handler'
import React from 'react'
import { Text, Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import 'firebase/firestore'
import 'firebase/auth'
import { Fuego, FuegoProvider } from '@nandorojo/swr-firestore'

import firebaseConfig from './api/index'
import Home from './screens/Home'
import CreateRoom from './screens/CreateRoom'

const Stack = createStackNavigator()
const fuego = new Fuego(firebaseConfig)

const linking = {
  prefixes: [
    `${
      Platform.OS === 'web' ? window.location.href : 'http://localhost:19006'
    }`,
  ],
  config: {
    screens: {
      Create: 'create',
    },
  },
}

const App = () => (
  <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
    <Stack.Navigator initialRouteName='Home' animationEnabled>
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='Create' component={CreateRoom} />
    </Stack.Navigator>
  </NavigationContainer>
)

export default () => (
  <FuegoProvider fuego={fuego}>
    <App />
  </FuegoProvider>
)
