import { Button, Heading } from '@chakra-ui/core';
import { Formik, Field, Form } from 'formik'
import React from 'react'
import { InputField } from '../components/inputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router'
import { Wrapper } from '../components/wrapper';
import { withUrqlClient, WithUrqlClient } from 'next-urql';
import { useApolloClient } from '@apollo/client';
import { withApollo } from '../utils/withApollo';

interface loginProps { }

const Login: React.FC<loginProps> = ({ }) => {

    const router = useRouter();

    const [login] = useLoginMutation()

    const apolloClient = useApolloClient()

    return (
        <Wrapper variant="small">
            <Heading mb={3}>Login Page:</Heading>
            <Formik initialValues={{ username: "", password: ""}}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login({variables: {username: values.username, password: values.password}})
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data?.login.errors))
                    } else if (response.data?.login.user) {
                        console.log("Success!: " + response.data.login.user)
                        await apolloClient.resetStore()
                        router.push("/")
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="username" placeholder="Username" label="Username"></InputField>
                        <InputField name="password" placeholder="Password" label="Password" type="password"></InputField>
                        <Button isLoading={isSubmitting} mt={3} variantColor="teal" type="submit">Login</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withApollo({ssr: true})(Login)