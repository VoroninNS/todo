import * as yup from 'yup';

export const create = yup.object({
    body: yup.object({
        name: yup.string().required('The ticket list name was missed or not valid'),
    }),
});

export const read_delete = yup.object({
    body: yup.object({
        ticket_list_id: yup.number().required('The ticket list id was missed or not valid'),
    }),
});