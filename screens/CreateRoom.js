import React, {useState, useEffect} from 'react'
import {View, Text, TextInput, Button, StyleSheet} from 'react-native'
import {useLinkTo} from '@react-navigation/native'
import firebase from 'firebase/app'
import {fuego, useCollection} from '@nandorojo/swr-firestore'
import {useAuthState} from 'react-firebase-hooks/auth'

const {
  firestore: {FieldValue},
} = firebase

const CreateRoom = () => {
  const [roomId, setRoomId] = useState('')
  const auth = fuego.auth()
  const [user] = useAuthState(auth)
  const linkTo = useLinkTo()

  const handlePress = () => {
    fuego.db
      .collection('room')
      .add({users: FieldValue.arrayUnion(user.uid)})
      .then(docRef => linkTo(`/room/${docRef.id}`))
  }

  return (
    <View>
      <Text>Create a room</Text>
      <TextInput
        style={styles.input}
        placeholder="Wpisz liczbę głosujących"
        value={roomId}
        onChangeText={setRoomId}
      />
      <Button title="Create a room" onPress={handlePress} />
      <Text>{roomId}</Text>
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
