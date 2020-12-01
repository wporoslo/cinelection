import React from 'react'
import { View, Button } from 'react-native'

export default function Home() {
  return (
    <View>
      <Button
        title='Create new room'
      />
      <Button
        title='Enter an existing room'
      />
    </View>
  )
}