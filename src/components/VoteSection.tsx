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
  const [, vote] = useVoteMutation();
  return (
    <Flex direction='column' alignItems='center' justifyContent='center' mr={4}>
      <IconButton
        icon='chevron-up'
        aria-label='upVote post'
        variantColor={post.voteStatus === 1 ? 'green' : undefined}
        onClick={async () => {
          if (post.voteStatus === 1) return;

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
        variantColor={post.voteStatus === -1 ? 'red' : undefined}
        onClick={async () => {
          if (post.voteStatus === -1) return;
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
