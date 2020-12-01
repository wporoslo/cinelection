import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import 'firebase/firestore'
import { Fuego, FuegoProvider } from '@nandorojo/swr-firestore'

import firebaseConfig from './api/index'
import Home from './screens/Home'

const Stack = createStackNavigator()
const fuego = new Fuego(firebaseConfig)

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName='Home' animationEnabled>
      <Stack.Screen name='Home' component={Home} />
    </Stack.Navigator>
  </NavigationContainer>
)

export default () => (
  <FuegoProvider fuego={fuego}>
    <App />
  </FuegoProvider>
)
