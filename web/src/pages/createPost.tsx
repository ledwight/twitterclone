import { Heading, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { title } from 'process';
import React from 'react'
import { InputField } from '../components/inputField';
import { useCreatePostMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { withApollo } from '../utils/withApollo';

const CreatePost: React.FC<{}> = ({ }) => {

    const [createPost] = useCreatePostMutation()
    const router = useRouter()

    return (
        <>
            <Heading mb={3}>Create Post:</Heading>
            <Formik initialValues={{ title: "", body: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await createPost({ variables: {title: values.title, body: values.body},
                    update: (cache) => {
                        cache.evict({ fieldName: "posts"})
                    }
                 })
                    console.log(response)
                    router.push('/')
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="title" placeholder="Title" label="Title"></InputField>
                        <InputField name="body" placeholder="Body" label="Body"></InputField>
                        <Button isLoading={isSubmitting} mt={3} variantColor="teal" type="submit">Create Post</Button>
                    </Form>
                )}
            </Formik>
        </>
    );
}

export default withApollo({ssr: false})(CreatePost)