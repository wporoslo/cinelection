/* eslint-disable react/display-name */
import 'react-native-gesture-handler'
import React from 'react'
import {Text, Button} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import * as Linking from 'expo-linking'
import 'firebase/firestore'
import 'firebase/auth'
import {Fuego, FuegoProvider} from '@nandorojo/swr-firestore'
import {useAuthState} from 'react-firebase-hooks/auth'

import {firebaseConfig} from './api'
import Home from './screens/Home'
import CreateRoom from './screens/CreateRoom'
import EnterRoom from './screens/EnterRoom'
import Room from './screens/Room'

const Stack = createStackNavigator()
const fuego = new Fuego(firebaseConfig)
const auth = fuego.auth()

const prefix = Linking.makeUrl('/')

const linking = {
  prefixes: [prefix, 'http://localhost:19006', 'popcorn://'],
  config: {
    screens: {
      Home: 'home',
      Create: 'create',
      Enter: 'enter',
      Room: 'room/:id',
    },
  },
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new fuego.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return <Button onPress={signInWithGoogle} title="Sign in with Google" />
}

const App = () => {
  const [user] = useAuthState(auth)
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Stack.Navigator initialRouteName="Home" animationEnabled>
        <Stack.Screen name="Home" component={user ? Home : SignIn} />
        <Stack.Screen name="Create" component={CreateRoom} />
        <Stack.Screen name="Enter" component={EnterRoom} />
        <Stack.Screen name="Room" component={Room} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default () => (
  <FuegoProvider fuego={fuego}>
    <App />
  </FuegoProvider>
)
