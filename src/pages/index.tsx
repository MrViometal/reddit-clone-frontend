import {
  Box,
  Link,
  Stack,
  Heading,
  Text,
  Flex,
  Button,
  IconButton,
} from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useState } from 'react';
import VoteSection from '../components/VoteSection';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });

  if (!fetching && !data) return <div>you have something wrong</div>;

  const posts =
    !data && fetching ? (
      <div>loading...</div>
    ) : (
      <Stack spacing={8}>
        {data!.posts.posts.map(p => (
          <Flex key={p.id} p={5} shadow='md' borderWidth='1px'>
            <VoteSection post={p} />
            <Box>
              <NextLink href='/post/[id]' as={`/post/${p.id}`}>
                <Link>
                  <Heading fontSize='xl'>{p.title}</Heading>
                </Link>
              </NextLink>
              <Text>posted by: {p.creator.username}</Text>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          </Flex>
        ))}
      </Stack>
    );

  const loadMoreButton = data?.posts.hasMore && (
    <Flex>
      <Button
        onClick={() =>
          setVariables({
            limit: variables.limit,
            cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
          })
        }
        isLoading={fetching}
        m='auto'
        my={8}
      >
        Load more...
      </Button>
    </Flex>
  );

  return (
    <Layout>
      {posts}
      {loadMoreButton}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
