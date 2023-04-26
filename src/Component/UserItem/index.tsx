import styles from './UserItem.module.scss';
import { TUser } from '../TSType';

import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSquareCheck, faSquareXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import axios from 'axios';

const cx = classNames.bind(styles);

interface Props {
    prop: TUser;
    index: number;
    handleDelete: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

interface FormValues {
    userName: string;
    email: string;
}

const UserItem: React.FC<Props> = ({ prop, handleDelete, index }) => {
    const [data, setData] = useState<TUser | undefined>();

    useEffect(() => {
        setData(prop);
    }, [prop]);

    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const initValue: FormValues = {
        userName: '',
        email: '',
    };
    const [formValues, setFormValues] = useState<FormValues>(initValue);

    const handleOpenEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
        setIsEditOpen(true);
    };

    const handleCloseEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault();
        setIsEditOpen(false);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer my_token',
    };

    const config = {
        headers: headers,
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmit(true);
        setIsEditOpen(false);
    };

    useEffect(() => {
        if (isSubmit) {
            const editData: TUser = {
                userName: formValues.userName,
                password: data?.password,
                email: formValues.email,
                createAt: data?.createAt,
                updateAt: moment(new Date()).format('DD/MM/YYYY'),
                id: data?.id,
            };
            axios
                .put(`http://localhost:4000/user/${data?.id}`, editData)
                .then((response) => {
                    setData(response.data);
                })
                .catch((error) => {
                    console.error('Error updating user:', error);
                });
        }
    }, [isSubmit]);

    return (
        <div className={cx('item')}>
            <div className={cx('id')}>{index + 1}</div>
            <div className={cx('name')}>{data?.userName}</div>
            <div className={cx('email')}>{data?.email}</div>
            <div className={cx('password')}>{data?.password}</div>
            <div className={cx('time')}>{data?.createAt}</div>
            <div className={cx('time')}>{data?.updateAt}</div>
            <div className={cx('edit')}>
                <span onClick={handleOpenEdit}>
                    <FontAwesomeIcon icon={faPen} />
                </span>
                <span onClick={handleDelete} data-index={data?.id} className={cx('delete')}>
                    <FontAwesomeIcon icon={faTrashCan} />
                </span>
            </div>
            <form
                className={cx({
                    'edit-form': true,
                    'is-open': isEditOpen,
                })}
                onSubmit={handleSubmit}
            >
                <div className={cx('inner')}>
                    <input
                        type="text"
                        name="userName"
                        value={formValues.userName}
                        className={cx('form-name')}
                        onChange={handleInput}
                    />
                    <input
                        type="text"
                        name="email"
                        value={formValues.email}
                        className={cx('form-email')}
                        onChange={handleInput}
                    />

                    <div className={cx('form-btn')}>
                        <button className={cx('abort')} onClick={handleCloseEdit}>
                            <FontAwesomeIcon icon={faSquareXmark} />
                        </button>

                        <button type="submit" className={cx('submit')}>
                            <FontAwesomeIcon icon={faSquareCheck} />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UserItem;
