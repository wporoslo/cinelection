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

const MovieCard = ({roomId, baseData, baseError, item, user}) => {
  const {data: movieData, update: updateMovie, error: movieError} = useDocument(
    roomId,
    {
      shouldRetryOnError: true,
      loadingTimeout: 2000,
      listen: true,
    },
  )

  const increment = () => {
    updateMovie({
      [`${item.id}.users`]: FieldValue.arrayUnion(user.uid),
      [`${item.id}.votes`]: FieldValue.increment(1),
    })
  }

  const decrement = () => {
    updateMovie({
      // [`${item.id}`]: user.id,
      [`${item.id}.votes`]: FieldValue.increment(-1),
    })
  }

  return (
    <View style={styles.card}>
      <Text>{item.title}</Text>
      <Image
        style={{
          height: 50,
          width: 50,
        }}
        source={{
          uri: `${baseData.images.base_url}${baseData.images.poster_sizes[4]}${item.poster_path}`,
        }}
      />
      <View style={styles.container}>
        <TouchableOpacity onPress={() => decrement()}>
          <AntDesign name="minuscircle" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => increment()}>
          <AntDesign name="pluscircle" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const Movies = ({roomId, user}) => {
  const {data: baseData, error: baseError} = useSWR(
    `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`,
    fetcher,
  )

  const {data: dataFromApi, error: errorFromApi} = useSWR(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`,
    fetcher,
  )

  const renderItem = ({item}) => (
    <MovieCard
      baseData={baseData}
      baseError={baseError}
      roomId={roomId}
      item={item}
      user={user}
    />
  )

  if (errorFromApi) return <Text>failed to load</Text>
  if (baseError) return <Text>failed to load</Text>
  if (!dataFromApi) return <Text>loading...</Text>
  if (!baseData) return <Text>loading...</Text>

  return (
    <FlatList
      data={dataFromApi.results}
      renderItem={renderItem}
      keyExtractor={item => JSON.stringify(item.id)}
    />
  )
}

const Room = ({route}) => {
  const roomId = `room/${route.params.id}`

  const auth = fuego.auth()
  const [user] = useAuthState(auth)

  const {data, update, error} = useDocument(roomId, {
    shouldRetryOnError: true,
    loadingTimeout: 2000,
    listen: true,
  })

  if (error) return <Text>Error!</Text>
  if (!data) return <Text>Loading...</Text>

  return (
    <View>
      <Text>{JSON.stringify(user.displayName)}</Text>
      <Movies roomId={roomId} user={user} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: `row`,
    justifyContent: `center`,
    alignItems: `center`,
  },
  card: {
    flexDirection: `column`,
    justifyContent: `center`,
    alignItems: `center`,
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, .18)',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  count: {
    marginHorizontal: 20,
  },
})

export default Room
