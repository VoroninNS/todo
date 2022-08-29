import * as yup from 'yup';

export const auth = yup.object({
    body: yup.object({
        login: yup.string().required('The login was missed or not valid'),
        password: yup.string().required('The password was missed or not valid'),
    }),
});
