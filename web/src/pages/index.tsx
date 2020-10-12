import React from 'react'
import { useMeQuery, usePostsQuery } from '../generated/graphql'
import CreatePost from './createPost'
import { Navbar } from '../components/navbar'
import { Box, Heading, Stack, Text } from '@chakra-ui/core'
import { Wrapper } from '../components/wrapper'
import { withApollo } from '../utils/withApollo'
const Index = () => {

  const { data } = usePostsQuery()
  const result = useMeQuery()

  function Feature({ title , desc, dateCreated } ){
    return (
      <Box p={5} bg="lightgrey" shadow="md" borderWidth="1px" flex="1" rounded="md">
        <Heading fontSize="xl">{title}</Heading>
        <Text mt={4}>{desc}</Text>
        <Text mt={4}>Posted at: {dateCreated}</Text>
      </Box>
    );
  }

  return (
    <>
      <Navbar></Navbar>
      <Wrapper variant="regular">
        <Heading>Twitter Clone!</Heading>
        <br />
        {result.data?.me ? (<CreatePost></CreatePost>) : (<Text fontSize="lg">To create a post, you must log in!</Text>)}
        <br />
        {!data ? (<>There are no posts</>) : data.posts.map(p => (
          <Stack key={p.id}>
            <Feature title={p.title} desc={p.body} dateCreated={p.createdAt}></Feature>
          </Stack>
        ))}
      </Wrapper>
    </>
  )
}

export default withApollo({ssr: true})(Index)