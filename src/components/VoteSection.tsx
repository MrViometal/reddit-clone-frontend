import { Flex, IconButton } from '@chakra-ui/core';
import React, { useState } from 'react';
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutationVariables,
} from '../generated/graphql';

interface VoteSectionProps {
  post: PostSnippetFragment;
}

const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'up-vote' | 'down-vote' | 'not-loading'
  >('not-loading');
  const [{ fetching, operation }, vote] = useVoteMutation();
  return (
    <Flex direction='column' alignItems='center' justifyContent='center' mr={4}>
      <IconButton
        icon='chevron-up'
        aria-label='upVote post'
        onClick={async () => {
          setLoadingState('up-vote');
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === 'up-vote'}
      />
      {post.points}
      <IconButton
        icon='chevron-down'
        aria-label='downVote post'
        onClick={async () => {
          setLoadingState('down-vote');
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === 'down-vote'}
      />
    </Flex>
  );
};
export default VoteSection;
