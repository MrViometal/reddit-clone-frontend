import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useState } from 'react';
import EditDeletePostButtons from '../components/EditDeletePostButtons';
import Layout from '../components/Layout';
import VoteSection from '../components/VoteSection';
import { useMeQuery, usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });

  const [{ data: meData }] = useMeQuery();
  const [{ data, fetching }] = usePostsQuery({ variables });

  if (!fetching && !data) return <div>you have something wrong</div>;

  const posts =
    !data && fetching ? (
      <div>loading...</div>
    ) : (
      <Stack spacing={8}>
        {data!.posts.posts.map(p =>
          !p ? null : (
            <Flex key={p.id} p={5} shadow='md' borderWidth='1px'>
              <VoteSection post={p} />
              <Box flex={1}>
                <NextLink href='/post/[id]' as={`/post/${p.id}`}>
                  <Link>
                    <Heading fontSize='xl'>{p.title}</Heading>
                  </Link>
                </NextLink>
                <Text>posted by: {p.creator.username}</Text>
                <Flex align='center'>
                  <Text mt={4}>{p.textSnippet}</Text>
                  {meData?.me?.id !== p.creator.id ? null : (
                    <Box ml='auto'>
                      <EditDeletePostButtons id={p.id} />
                    </Box>
                  )}
                </Flex>
              </Box>
            </Flex>
          ),
        )}
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
