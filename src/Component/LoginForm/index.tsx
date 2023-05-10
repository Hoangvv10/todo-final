import { useContext, useState } from 'react';
import classNames from 'classnames/bind';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import styles from './LoginForm.module.scss';
import FormInput from '../FormInput';
import { TUser } from '../TSType';
import { UserContext } from '../../store/UserContext';
import useGetAxios from '../axiosHooks/useGetAxios';
import usePostAxios from '../axiosHooks/usePostAxios';
import { USER_API_URL } from '../APIs';

const cx = classNames.bind(styles);

interface FormValues {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

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

const LoginForm: React.FC = () => {
    const { data: usersData } = useGetAxios<TUser[]>(USER_API_URL);

    const initValue: FormValues = {
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    };
    const [formValues, setFormValues] = useState<FormValues>(initValue);
    const [isLogin, setIsLogin] = useState<boolean>(true);

    const { setUserId } = useContext(UserContext);

    const postData = usePostAxios;

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
        {
            id: 4,
            name: 'confirmPassword',
            type: 'text',
            placeholder: 'Confirm Password...',
            errorMessage: "Passwords don't match!",
            label: 'Confirm Password',
            pattern: formValues.password,
            required: true,
        },
    ];

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSignUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        setIsLogin((prev) => !prev);
        setFormValues(initValue);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { userName, email, password } = formValues;

        if (usersData) {
            const user = usersData?.find((u: TUser) => u.userName === userName && u.password === password);
            const userRegister = usersData?.find((u: TUser) => u.userName === userName);
            if (isLogin) {
                if (user) {
                    if (!!user.id) {
                        setUserId(user.id);
                        localStorage.setItem('userId', user.id.toString());
                    }
                    toast.success('Success!', {
                        position: 'top-right',
                        autoClose: 3000,
                    });
                } else {
                    toast.error('Error!', {
                        position: 'top-right',
                        autoClose: 3000,
                    });
                }
                setFormValues(initValue);
            } else {
                if (userRegister) {
                    toast.error('Username is not available', {
                        position: 'top-right',
                        autoClose: 3000,
                    });
                    setFormValues({ userName: '', email: email, password: password, confirmPassword: '' });
                } else {
                    const userData: TUser = {
                        userName: userName,
                        email: email,
                        password: password,
                        createAt: moment(new Date()).format('DD/MM/YYYY'),
                        updateAt: moment(new Date()).format('DD/MM/YYYY'),
                    };
                    const { data: postResult } = await postData<TUser>(USER_API_URL, userData);

                    if (postResult) {
                        toast.success('Success!', {
                            position: 'top-right',
                            autoClose: 3000,
                        });

                        if (!!postResult.id) {
                            localStorage.setItem('userId', postResult.id.toString());
                            setUserId(postResult.id);
                        }
                    } else {
                        toast.error(`Error`, {
                            position: 'top-right',
                            autoClose: 3000,
                        });
                    }
                    setFormValues(initValue);
                    setIsLogin(true);
                }
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <form action="" className={cx('form')} onSubmit={handleSubmit}>
                <div className={cx('header')}>{isLogin ? 'Log In' : 'Sign Up'}</div>
                <div className={cx('body')}>
                    {isLogin
                        ? logInInputs.map((input) => (
                              <FormInput
                                  key={input.id}
                                  {...input}
                                  value={formValues[input.name as keyof FormValues]}
                                  onChange={handleInput}
                              />
                          ))
                        : signUpInputs.map((x) => (
                              <FormInput
                                  key={x.id}
                                  {...x}
                                  value={formValues[x.name as keyof FormValues]}
                                  onChange={handleInput}
                              />
                          ))}
                </div>
                <button type="submit" className={cx('submit')}>
                    {isLogin ? 'Log In' : 'Sign Up'}
                </button>
                {isLogin ? (
                    <div className={cx('sign-up')} onClick={handleSignUp}>
                        Create your account
                        <FontAwesomeIcon icon={faArrowRight} />
                    </div>
                ) : (
                    <div className={cx('login')}>
                        Have account yet?
                        <span className={cx('login-btn')} onClick={handleSignUp}>
                            Login
                        </span>
                    </div>
                )}
            </form>
        </div>
    );
};

export default LoginForm;
