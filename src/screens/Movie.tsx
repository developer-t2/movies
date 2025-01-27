import React, { memo, useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

import { movieApi } from '../lib/api';
import {
  Horizontal,
  HorizontalSlider,
  HorizontalSwiper,
  List,
  ScrollViewContainer,
  Vertical,
} from '../components';
import { Slide } from '../components/movie';

const StyledPressable = styled.Pressable({
  alignItems: 'flex-end',
  marginBottom: 4,
});

const StyledText = styled.Text({
  color: '#fff',
  fontWeight: 'bold',
  opacity: 0.8,
  marginRight: 4,
});

const Movie = () => {
  const navigation = useNavigation();

  const [movies, setMovies] = useState({
    isReady: false,
    nowPlaying: [
      {
        id: 0,
        backdrop_path: '',
        poster_path: '',
        title: '',
        vote_average: 0,
        overview: '',
      },
    ],
    upcoming: [
      {
        id: 0,
        poster_path: '',
        title: '',
      },
    ],
    popular: [
      {
        id: 0,
        poster_path: '',
        title: '',
        vote_average: 0,
        overview: '',
      },
    ],
    error: null,
  });

  const getData = useCallback(async () => {
    const [nowPlaying, nowPlayingError] = await movieApi.nowPlaying();
    const [popular, popularError] = await movieApi.popular();
    const [upcoming, upcomingError] = await movieApi.upcoming();

    const error = nowPlayingError || popularError || upcomingError;

    setMovies({ isReady: true, nowPlaying, popular, upcoming, error });
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const onPress = useCallback(() => {
    navigation.navigate('Discovery', { movies: movies.nowPlaying });
  }, [navigation, movies.nowPlaying]);

  return (
    <ScrollViewContainer isReady={movies.isReady} refreshFunction={getData}>
      <SafeAreaView>
        <HorizontalSwiper>
          {movies.nowPlaying.map(movie => (
            <Slide
              key={movie.id}
              id={movie.id}
              backdropImage={movie.backdrop_path}
              poster={movie.poster_path}
              title={movie.title}
              vote={movie.vote_average}
              overview={movie.overview}
            />
          ))}
        </HorizontalSwiper>

        <StyledPressable onPress={onPress}>
          <StyledText>상영 영화 포스터 보기</StyledText>
        </StyledPressable>

        <HorizontalSlider title="개봉 예정 영화">
          {movies.upcoming.map(movie => (
            <Vertical
              key={movie.id}
              id={movie.id}
              poster={movie.poster_path}
              title={movie.title}
            />
          ))}
        </HorizontalSlider>

        <List title="인기 영화">
          {movies.popular.map(movie => (
            <Horizontal
              key={movie.id}
              id={movie.id}
              poster={movie.poster_path}
              title={movie.title}
              vote={movie.vote_average}
              overview={movie.overview}
            />
          ))}
        </List>
      </SafeAreaView>
    </ScrollViewContainer>
  );
};

export default memo(Movie);
