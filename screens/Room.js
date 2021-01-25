import React, {useState, createRef} from 'react'
import firebase from 'firebase/app'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native'
import useSWR from 'swr'
import {fuego, useDocument} from '@nandorojo/swr-firestore'
import {useAuthState} from 'react-firebase-hooks/auth'
import Swiper from 'react-native-deck-swiper'
import {AntDesign} from '@expo/vector-icons'

import {TMDBApiKey} from '../api'

const {TMDBApiKey: apiKey} = TMDBApiKey

const {
  firestore: {FieldValue},
} = firebase

const fetcher = (...args) => fetch(...args).then(res => res.json())

const swiperRef = createRef()

const MovieCard = ({baseData, item}) => (
  <View style={styles.card}>
    <Text>{item.title}</Text>
    <Image
      style={styles.cardImage}
      source={{
        uri: `${baseData.images.base_url}${baseData.images.poster_sizes[4]}${item.poster_path}`,
      }}
    />
  </View>
)

const Movies = ({roomId, user}) => {
  const [index, setIndex] = useState(0)
  const onSwiped = () => {
    setIndex(index + 1)
  }

  const {data: movieData, update: updateMovie, error: movieError} = useDocument(
    roomId,
    {
      shouldRetryOnError: true,
      loadingTimeout: 2000,
      listen: true,
    },
  )

  const {data: baseData, error: baseError} = useSWR(
    `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`,
    fetcher,
  )

  const {data: dataFromApi, error: errorFromApi} = useSWR(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`,
    fetcher,
  )

  const increment = ({id}) => {
    updateMovie({
      [`movies.${id}.users`]: FieldValue.arrayUnion(user.uid),
      [`movies.${id}.votes`]: FieldValue.increment(1),
    })
  }

  const decrement = () => {
    updateMovie({
      // [`${item.id}`]: user.id,
      [`${item.id}.votes`]: FieldValue.increment(-1),
    })
  }

  const Card = ({card}) => <MovieCard baseData={baseData} item={card} />

  if (errorFromApi || baseError) return <Text>failed to load</Text>
  if (!dataFromApi || !baseData) return <Text>loading...</Text>

  return (
    <Swiper
      ref={swiperRef}
      cards={dataFromApi.results}
      cardIndex={index}
      renderCard={card => <Card card={card} />}
      onSwiped={onSwiped}
      onSwipedLeft={() => console.log('NOPE')}
      onSwipedRight={card => increment(dataFromApi.results[card])}
      disableBottomSwipe
      disableTopSwipe
      stackSize={4}
      stackScale={5}
      stackSeparation={10}
      backgroundColor="transparent"
      overlayLabels={{
        left: {
          title: 'Nope',
          style: {
            wrapper: {
              elevation: 5,
            },
          },
        },
      }}
    />
    // <FlatList
    //   data={dataFromApi.results}
    //   renderItem={renderItem}
    //   keyExtractor={item => JSON.stringify(item.id)}
    // />
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
      <Movies roomId={roomId} user={user} />
      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => swiperRef.current.swipeLeft()}>
          <AntDesign name="minuscircle" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => swiperRef.current.swipeRight()}>
          <AntDesign name="pluscircle" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text>{data.users.length} użytkowników</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignContent: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 0.45,
    borderRadius: 8,
    shadowRadius: 25,
    shadowColor: 'black',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 0},
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 200,
    elevation: 5,
  },
  cardImage: {
    width: 160,
    flex: 1,
    resizeMode: 'contain',
  },
  count: {
    marginHorizontal: 20,
  },
})

export default Room
