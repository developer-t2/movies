import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';

import { getImageUri, movieApi } from '../lib/api';
import { formatDate } from '../lib/date';
import { Poster, ScrollViewContainer, Vote } from '../components';

interface IStyledBackdropImage {
  height: number;
}

const StyledBackdropImage = styled.Image<IStyledBackdropImage>(
  ({ height }) => ({
    width: '100%',
    height: height / 3,
    opacity: 0.4,
  })
);

interface IStyledHeaderContainer {
  height: number;
}

const StyledHeaderContainer = styled.View<IStyledHeaderContainer>(
  ({ height }) => ({
    width: '100%',
    height: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    bottom: height / 6,
    marginBottom: 48,
  })
);

interface IStyledPosterContainer {
  width: number;
  height: number;
}

const StyledPosterContainer = styled.View<IStyledPosterContainer>(
  ({ width, height }) => ({
    width: width / 4,
    height: height / 5,
  })
);

const StyledInfoContainer = styled.View({
  width: '56%',
  marginTop: 32,
  marginLeft: 24,
});

const StyledTitle = styled.Text({
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 20,
  marginBottom: 4,
});

const StyledContentsContainer = styled.View({
  paddingHorizontal: 24,
  marginBottom: 24,
});

const StyledContentsTitle = styled.Text({
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 8,
});

const StyledContents = styled.Text({
  color: '#fff',
});

type IDetailRoute = {
  details: { id: number };
};

const Details = () => {
  const {
    params: { id },
  } = useRoute<RouteProp<IDetailRoute, 'details'>>();

  const { width, height } = useWindowDimensions();

  const [details, setDetails] = useState({
    isReady: false,
    backdrop_path: '',
    poster_path: '',
    title: '',
    vote_average: 0,
    overview: '',
    release_date: '',
    error: null,
  });

  const source = useMemo(() => ({ uri: getImageUri(details.backdrop_path) }), [
    details.backdrop_path,
  ]);

  const formattedDate = useMemo(() => formatDate(details.release_date, true), [
    details.release_date,
  ]);

  const getData = useCallback(async () => {
    const [details, error] = await movieApi.details(id);

    setDetails({ isReady: true, ...details, error });
  }, [id]);

  console.log(details);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <ScrollViewContainer isReady={details.isReady} refreshFunction={getData}>
      <>
        <StyledBackdropImage source={source} height={height} />

        <StyledHeaderContainer height={height}>
          <StyledPosterContainer width={width} height={height}>
            <Poster poster={details.poster_path} />
          </StyledPosterContainer>

          <StyledInfoContainer>
            <StyledTitle>{details.title}</StyledTitle>
            <Vote vote={details.vote_average} />
          </StyledInfoContainer>
        </StyledHeaderContainer>

        {details.overview && (
          <StyledContentsContainer>
            <StyledContentsTitle>Overview</StyledContentsTitle>
            <StyledContents>{details.overview}</StyledContents>
          </StyledContentsContainer>
        )}

        {details.release_date && (
          <StyledContentsContainer>
            <StyledContentsTitle>Release Date</StyledContentsTitle>
            <StyledContents>{formattedDate}</StyledContents>
          </StyledContentsContainer>
        )}
      </>
    </ScrollViewContainer>
  );
};

export default memo(Details);
