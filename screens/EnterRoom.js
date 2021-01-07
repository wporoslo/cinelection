import React, { useState } from 'react'
import { View, Button, Text, TextInput } from 'react-native'
import firebase from 'firebase/app'
import { useDocument } from '@nandorojo/swr-firestore'

import { useLinkTo } from "@react-navigation/native";

const EnterRoom = () => {
  const linkTo = useLinkTo();
  const [roomId, setRoomId] = useState('')

  const { data, update, error } = useDocument(`room/${roomId}`)

  const handlePress = () => {
    if (error) return console.log('error')
    if (!data) return console.log('loading')
    update({
      activeConnections: firebase.firestore.FieldValue.increment(1),
    }).then(() => linkTo(`/room/${roomId}`))
    
  }

  return (
    <View>
      <TextInput
        placeholder='numer pokoju'
        value={roomId}
        onChangeText={setRoomId}
      />
      <Button title='Enter the room' onPress={handlePress} />
      <Text>{roomId}</Text>
    </View>
  )
}

export default EnterRoom
