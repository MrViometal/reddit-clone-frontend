import { useRouter } from 'next/router';
import { usePostQuery } from '../generated/graphql';
import { useGetIntId } from './useGetIntId';

export const useGetPostFromURL = () => {
  const intId = useGetIntId();

  return usePostQuery({
    pause: intId === -1, //bad request, don't send
    variables: {
      id: intId,
    },
  });
};
