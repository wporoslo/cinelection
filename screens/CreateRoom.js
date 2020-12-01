import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import { useDocument } from '@nandorojo/swr-firestore'

const CreateRoom = () => {
  const [userCount, setUserCount] = useState(0)

  const { data, set } = useDocument(`room/5pbn7zjaqdu`, { listen: true })

  const handlePress = () => {
    const id = Math.random().toString(36).substring(2)

    set({ userCount, movies: { godfather: 1, roman: "pizda" } }, { merge: true })
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
      <Text sx={{ color: `#000` }}>{data ? data.userCount : 'loading'}</Text>
      <Button title='Update a room' onPress={handlePress} />
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
