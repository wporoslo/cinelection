import React from 'react'
import firebase from 'firebase/app'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import {fuego, useDocument} from '@nandorojo/swr-firestore'
// import { TouchableOpacity } from 'react-native-gesture-handler'
import {useAuthState} from 'react-firebase-hooks/auth'
import useSWR from 'swr'

import {AntDesign} from '@expo/vector-icons'

import {TMDBApiKey} from '../api'

const {TMDBApiKey: apiKey} = TMDBApiKey

const {
  firestore: {FieldValue},
} = firebase

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Movie = () => {
  const {data, error} = useSWR(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`,
    fetcher,
  )

  const {data: imageData, error: imageError} = useSWR(
    `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`,
    fetcher,
  )

  if (error) return <Text>failed to load</Text>
  if (!data) return <Text>loading...</Text>

  const renderItem = ({item}) => (
    <View
      style={{
        flexDirection: `column`,
      }}
    >
      <Text>{item.title}</Text>
      <Image
        style={{
          height: 50,
          width: 50,
        }}
        source={{
          uri: `${imageData.images.base_url}${imageData.images.poster_sizes[4]}${item.poster_path}`,
        }}
      />
    </View>
  )

  return (
    <FlatList
      data={data.results}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  )
}

const Room = ({route}) => {
  const roomId = `room/${route.params.id}`

  const auth = fuego.auth()
  const [user] = useAuthState(auth)

  const {data, update, error} = useDocument(roomId, {
    shouldRetryOnError: true,
    onSuccess: console.log,
    loadingTimeout: 2000,
    listen: true,
  })

  const increment = () => {
    update({a: FieldValue.increment(1)})
  }
  const decrement = () => {
    update({a: FieldValue.increment(-1)})
  }

  if (error) return <Text>Error!</Text>
  if (!data) return <Text>Loading...</Text>

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={decrement}>
          <AntDesign name="minuscircle" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={increment}>
          <AntDesign name="pluscircle" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text>{JSON.stringify(user.displayName)}</Text>
      <Movie />
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
