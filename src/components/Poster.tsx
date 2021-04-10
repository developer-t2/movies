import React, { FC, memo, useMemo } from 'react';
import styled from 'styled-components/native';

import { getImageUri } from '../lib/api';

interface IStyledImage {
  borderRadius: number;
}

const StyledImage = styled.Image<IStyledImage>(({ borderRadius }) => ({
  flex: 1,
  borderRadius,
}));

interface IPoster {
  poster: string;
  borderRadius?: number;
}

const Poster: FC<IPoster> = ({ poster, borderRadius = 4 }) => {
  const source = useMemo(() => ({ uri: getImageUri(poster) }), [poster]);

  return <StyledImage source={source} borderRadius={borderRadius} />;
};

export default memo(Poster);
