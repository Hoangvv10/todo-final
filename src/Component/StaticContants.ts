const ADMIN_ID: number = 1;

interface Input {
    id: number;
    name: string;
    type: string;
    placeholder: string;
    errorMessage?: string;
    label: string;
    pattern?: string;
    required: boolean;
    autoComplete?: string;
}

const logInInputs: Input[] = [
    {
        id: 6,
        name: 'userName',
        type: 'text',
        placeholder: 'Username...',
        label: 'Username',
        required: false,
        pattern: '^[A-Za-z0-9]{3,16}$',
        autoComplete: 'username',
    },
    {
        id: 99,
        name: 'password',
        type: 'password',
        placeholder: 'Password...',
        label: 'Password',
        required: false,
        autoComplete: 'current-password',
    },
];

const signUpInputs: Input[] = [
    {
        id: 1,
        name: 'userName',
        type: 'text',
        placeholder: 'Username...',
        errorMessage: "Username should be 3-16 characters and shouldn't include any special character!",
        label: 'Username',
        pattern: '^[A-Za-z0-9]{3,16}$',
        required: true,
        autoComplete: 'username',
    },
    {
        id: 2,
        name: 'email',
        type: 'email',
        placeholder: 'Email...',
        errorMessage: 'It should be a valid email address!',
        label: 'Email',
        required: true,
    },
    {
        id: 3,
        name: 'password',
        type: 'text',
        placeholder: 'Password...',
        errorMessage:
            'Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!',
        label: 'Password',
        pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
        required: true,
    },
];

export { ADMIN_ID, logInInputs, signUpInputs };
