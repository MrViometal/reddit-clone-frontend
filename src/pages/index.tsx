import { Box, Link, Stack, Heading, Text, Flex, Button } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useState } from 'react';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });

  if (!fetching && !data) return <div>you have something wrong</div>;

  const header = (
    <Flex align='center'>
      <Heading>LiReddit</Heading>
      <Box ml='auto' style={{ color: 'green' }}>
        <NextLink href='/create-post'>
          <Link>Create Post</Link>
        </NextLink>
      </Box>
    </Flex>
  );

  const posts =
    !data && fetching ? (
      <div>loading...</div>
    ) : (
      <Stack spacing={8}>
        {data!.posts.posts.map(p => (
          <Box key={p.id} p={5} shadow='md' borderWidth='1px'>
            <Heading fontSize='xl'>{p.title}</Heading>
            <Text mt={4}>{p.textSnippet}</Text>
          </Box>
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
      {header}
      <br />
      {posts}
      {loadMoreButton}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
