import React, {useState} from 'react'
import {View, Button, Text, TextInput} from 'react-native'
import firebase from 'firebase/app'
import {fuego, useDocument} from '@nandorojo/swr-firestore'
import {useAuthState} from 'react-firebase-hooks/auth'

import {useLinkTo} from '@react-navigation/native'

const {
  firestore: {FieldValue},
} = firebase

const EnterRoom = () => {
  const [roomId, setRoomId] = useState('')
  const auth = fuego.auth()
  const [user] = useAuthState(auth)
  const {data, update, error} = useDocument(`room/${roomId}`)

  const linkTo = useLinkTo()
  const handlePress = () => {
    if (error) return console.log('error')
    if (!data) return console.log('loading')
    update({
      activeConnections: FieldValue.increment(1),
      users: FieldValue.arrayUnion(user.uid),
    }).then(() => linkTo(`/room/${roomId}`))
  }

  return (
    <View>
      <TextInput
        placeholder="numer pokoju"
        value={roomId}
        onChangeText={setRoomId}
      />
      <Button title="Enter the room" onPress={handlePress} />
      <Text>{roomId}</Text>
    </View>
  )
}

export default EnterRoom
