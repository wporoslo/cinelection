import React from 'react'
import { View, Button } from 'react-native'

export default function Home({ navigation }) {
  return (
    <View>
      <Button
        onPress={() => navigation.navigate('Create')}
        title='Create new room'
      />
      <Button title='Enter an existing room' />
    </View>
  )
}
