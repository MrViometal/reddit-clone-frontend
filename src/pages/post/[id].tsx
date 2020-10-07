import { Box, Heading } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import EditDeletePostButtons from '../../components/EditDeletePostButtons';
import Layout from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useGetPostFromURL } from '../../utils/useGetPostFromURL';

const Post = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromURL();

  if (fetching)
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>couldn't find your post, what a shame!</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      <Box mb={4}>{data.post.text}</Box>
      <EditDeletePostButtons id={data.post.id} />
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
