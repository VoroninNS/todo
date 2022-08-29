import * as yup from 'yup';

export const permit = yup.object({
    body: yup.object({
        ticket_list_id: yup.string().required('The ticket list id was missed or not valid'),
        login: yup.string().required('The login was missed or not valid'),
    }),
});
