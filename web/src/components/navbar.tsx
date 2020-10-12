import { Box, Button, Flex, Link, Text } from '@chakra-ui/core';
import NextLink from "next/link"
import { useRouter } from 'next/router';
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { useApolloClient } from "@apollo/client";

export const Navbar: React.FC<{}> = ({ }) => {
    const router = useRouter()
    const [logout] = useLogoutMutation()
    const { data, loading } = useMeQuery()
    const apolloClient = useApolloClient();
    let body = null

    if (loading) {
        //fetching data
    } else if (!data?.me) {
        //user isn't logged in
        body = (
            <>
                <NextLink href="/login">
                    <Link color={"white"} pr={3}>Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color={"white"}>Register</Link>
                </NextLink>
            </>
        )
    } else {
        //user is logged in
        body = (
            <Flex>
                <Text fontSize="2xl">Hello! {data.me.name}</Text>
                <Button ml={3} variant="outline" onClick={async () => {
                    await logout();
                    await apolloClient.resetStore()
                    router.push('/')
                }}>Logout</Button>
            </Flex>
        )
    }

    return (
        <Flex bg="grey" p={4}>
            <Box ml={"auto"}>
                {body}
            </Box>
        </Flex>
    );
}