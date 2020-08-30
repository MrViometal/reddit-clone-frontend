import React from 'react';
import { Box, Link, Flex, Button } from '@chakra-ui/core';
import NextLink from 'next/link';
import { useMeQuery } from '../generated/graphql';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }, me] = useMeQuery();
  let body = null;

  if (fetching) {
    //data is loading
  } else if (!data?.me) {
    //user not logged in
    body = (
      <>
        <NextLink href='/login'>
          <Link color='white' mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href='/register'>
          <Link color='white' mr={2}>
            Register
          </Link>
        </NextLink>
      </>
    );
  } else {
    //use is logged in
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button variant='link'>Logout</Button>
      </Flex>
    );
  }

  return (
    <Flex bg='tan' p={4}>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  );
};
