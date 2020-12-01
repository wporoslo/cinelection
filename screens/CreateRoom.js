import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import firebase from 'firebase/app'
import 'firebase/firestore'
import firebaseConfig from '../api/index'

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

const firestore = firebase.firestore()
const roomRef = firestore.collection('room')

const CreateRoom = () => {
  const [userCount, setUserCount] = useState(0)
  const [room, setRoom] = useState(null)

  async function handlePress() {
    const id = Math.random().toString(36).substring(2)
    const room = { id, userCount, movies: { harypotter: 11 } }
    setRoom(room)
    await roomRef.doc(id).set(room)
  }
  return (
    <View>
      <Text>Create a room</Text>
      <TextInput
        style={styles.input}
        placeholder='Wpisz liczbę głosujących'
        value={userCount}
        onChangeText={setUserCount}
      />
      <Text sx={{ color: `#000` }}>{userCount}</Text>
      <Button title='Create a room' onPress={handlePress} />
    </View>
  )
}

const styles = StyleSheet.create({
  contrainer: {},
  input: {
    borderWidth: 1,
    borderColor: `#000`,
    color: `#000`,
    padding: 12,
  },
})

export default CreateRoom
