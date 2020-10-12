import { FormControl, FormLabel, Input, FormErrorMessage, Button, Heading } from '@chakra-ui/core';
import { Formik, Field, Form } from 'formik'
import React from 'react'
import { InputField } from '../components/inputField';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router'
import { Wrapper } from '../components/wrapper';
import { withApollo } from '../utils/withApollo';

interface registerProps { }

const Register: React.FC<registerProps> = ({ }) => {

  const router = useRouter();

  const [register] = useRegisterMutation()

  return (
    <Wrapper variant="small">
      <Heading mb={3}>Registration Page:</Heading>
      <Formik initialValues={{ username: "", password: "", name: "", email: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({variables: values,
          update: (cache, {data}) => {
            cache.writeQuery<MeQuery>({
              query: MeDocument,
              data: {
                __typename: "Query",
                me: data?.createUser.user
              }
            })
          }})
          if (response.data?.createUser.errors) {
            setErrors(toErrorMap(response.data.createUser.errors))
          } else if (response.data?.createUser.user) {
            router.push("/")
          }
        }}>
        {({ isSubmitting }) => (
          <Form>
            <InputField name="username" placeholder="Username" label="Username"></InputField>
            <InputField name="password" placeholder="Password" label="Password" type="password"></InputField>
            <InputField name="name" placeholder="Name" label="Name"></InputField>
            <InputField name="email" placeholder="E-mail" label="E-Mail"></InputField>
            <Button isLoading={isSubmitting} mt={3} variantColor="teal" type="submit">Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withApollo({ssr: true})(Register)