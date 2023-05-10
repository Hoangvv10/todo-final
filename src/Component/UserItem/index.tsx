import styles from './UserItem.module.scss';
import { TUser } from '../TSType';

import classNames from 'classnames/bind';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSquareCheck, faSquareXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { toast } from 'react-toastify';
import { USER_API_URL } from '../APIs';
import usePutAxios from '../axiosHooks/usePutAxios';
import ItemForm from '../ItemForm';

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
    const putData = usePutAxios;

    const [data, setData] = useState<TUser | undefined>(prop);

    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const editData: TUser = {
            userName: formValues.userName === '' && data ? data?.userName : formValues.userName,
            password: data?.password,
            email: formValues.email === '' && data ? data?.email : formValues.email,
            createAt: data?.createAt,
            updateAt: moment(new Date()).format('DD/MM/YYYY'),
            id: data?.id,
        };

        const result = await putData<TUser>(USER_API_URL + data?.id, editData);
        if (result.data) {
            setData(result.data);
        } else {
            toast.error(`Error: ${result.error?.message}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }

        setIsEditOpen(false);
    };

    return (
        <div
            className={cx({
                item: true,
                'is-first': index === 0 && isEditOpen,
            })}
        >
            <div className={cx('id')}>{data?.id}</div>
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

            <ItemForm
                isItem={false}
                isEditOpen={isEditOpen}
                userData={data}
                handleUserInput={handleInput}
                handleCloseEdit={handleCloseEdit}
                formValues={formValues}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default UserItem;
