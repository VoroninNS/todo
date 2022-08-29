import * as yup from 'yup';

export const create = yup.object({
    body: yup.object({
        name: yup.string().required('The ticket name was missed or not valid'),
        ticket_list_id: yup.string().required('The ticket list id was missed or not valid'),
    }),
});

export const read_delete = yup.object({
    body: yup.object({
        id: yup.string().required('The ticket id was missed or not valid'),
    }),
});

export const update = yup.object({
    body: yup.object({
        id: yup.string().required('The ticket id was missed or not valid'),
        name: yup.string().required('The ticket name was missed or not valid'),
    }),
});
