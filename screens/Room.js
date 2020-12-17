import React from 'react'
import firebase from 'firebase/app'
import {
  View,
  Text,
  StyleSheet,
  // Platform,
  TouchableOpacity,
} from 'react-native'
import { fuego, useDocument } from '@nandorojo/swr-firestore'
// import { TouchableOpacity } from 'react-native-gesture-handler'

import { AntDesign } from '@expo/vector-icons'

const {
  firestore: { FieldValue },
} = firebase

const Room = ({ route }) => {
  console.log(route)
  const roomId = `room/${route.params.id}`

  const { data, update, error } = useDocument(roomId, {
    shouldRetryOnError: true,
    onSuccess: console.log,
    loadingTimeout: 2000,
    listen: true,
  })

  const increment = () => {
    update({ activeConnections: FieldValue.increment(1) })
  }
  const decrement = () => {
    update({ activeConnections: FieldValue.increment(-1) })
  }
  if (error) return <Text>Error!</Text>
  if (!data) return <Text>Loading...</Text>

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={decrement}>
          <AntDesign name='minuscircle' size={24} color='black' />
        </TouchableOpacity>
        <TouchableOpacity onPress={increment}>
          <AntDesign name='pluscircle' size={24} color='black' />
        </TouchableOpacity>
      </View>
      <Text>{data.activeConnections}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: `row`,
    justifyContent: `center`,
    alignItems: `center`,
  },
  count: {
    marginHorizontal: 20,
  },
})

export default Room
