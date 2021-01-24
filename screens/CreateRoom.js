import React, {useState, useEffect} from 'react'
import {View, Text, TextInput, Button, StyleSheet} from 'react-native'
import {useLinkTo} from '@react-navigation/native'
import {fuego, useCollection} from '@nandorojo/swr-firestore'

const CreateRoom = ({navigation}) => {
  const [roomId, setRoomId] = useState('')
  const linkTo = useLinkTo()

  useEffect(() => {
    const id = Math.random().toString(36).substring(2)
    setRoomId(id)
  }, [])

  // const { data, add } = useCollection(`room`)

  const handlePress = () => {
    // console.log(data)
    fuego.db
      .collection('room')
      .add({activeConnections: 1})
      .then(docRef => linkTo(`/room/${docRef.id}`))
  }
  // add({ roomId, activeConnections: 1 }, { merge: true })
  // navigation.navigate('room', { id: 'roman' })
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
