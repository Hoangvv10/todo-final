import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSquareXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';

import { TaskItems } from '../TSType';
import styles from './Item.module.scss';
import { Category, Status } from '../TSType';

const cx = classNames.bind(styles);

interface Props {
    item: TaskItems;
    index: number;
    handleDelete: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
    isAdd?: boolean;
    handleAdd?: (value: TaskItems | null) => void;
    userId: number;
}

interface FormValues {
    title: string;
    category: Category | '';
    status: Status | '';
    content: string;
}

const Item: React.FC<Props> = ({ item, index, handleDelete, isAdd, handleAdd, userId }) => {
    const [data, setData] = useState<TaskItems | undefined>();
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const initValue: FormValues = {
        title: '',
        category: '',
        status: '',
        content: '',
    };
    const [formValues, setFormValues] = useState<FormValues>(initValue);

    useEffect(() => {
        setData(item);
    }, [item]);

    const handleOpenEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
        setIsEditOpen(true);
    };

    const handleCloseEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault();
        setIsEditOpen(false);
        if (handleAdd) handleAdd(null);
    };

    const handleInput = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLSelectElement>,
    ): void => {
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
            const addData = {
                content: formValues.content,
                title: formValues.title,
                status: formValues.status,
                category: formValues.category,
                userId: userId,
                createAt: moment(new Date()).format('DD/MM/YYYY'),
                updateAt: moment(new Date()).format('DD/MM/YYYY'),
            };

            const editData: TaskItems = {
                content: formValues.content,
                title: formValues.title,
                status: formValues.status,
                category: formValues.category,
                userId: userId,
                createAt: item.createAt,
                updateAt: moment(new Date()).format('DD/MM/YYYY'),
                id: item.id,
            };
            if (!isAdd) {
                axios
                    .put(`http://localhost:4000/data/${item.id}`, editData)
                    .then((response) => {
                        setData(response.data);
                    })
                    .catch((error) => {
                        console.error('Error updating user:', error);
                    });
            } else {
                axios
                    .post('http://localhost:4000/data', addData, config)
                    .then((response) => {
                        if (handleAdd) handleAdd(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
    }, [isSubmit]);

    return (
        <div className={cx('item')}>
            <div className={cx('id')}>{index + 1}</div>
            <div className={cx('title')}>{data?.title}</div>
            <div className={cx('content')}>{data?.content}</div>
            <div className={cx('date')}>{data?.updateAt}</div>
            <div className={cx('category')}>
                <div
                    className={cx({
                        red: data?.category === 'red',
                        yellow: data?.category === 'yellow',
                        green: data?.category === 'green',
                    })}
                ></div>
            </div>
            <div className={cx('status')}>{data?.status}</div>
            <div className={cx('edit')}>
                <span onClick={handleOpenEdit}>
                    <FontAwesomeIcon icon={faPen} />
                </span>
                <span onClick={handleDelete} data-index={item.id} className={cx('delete')}>
                    <FontAwesomeIcon icon={faTrashCan} />
                </span>
            </div>
            <form
                className={cx({
                    'edit-form': true,
                    'is-open': isEditOpen || isAdd,
                })}
                onSubmit={handleSubmit}
            >
                <div className={cx('inner')}>
                    <input
                        type="text"
                        name="title"
                        value={formValues.title}
                        className={cx('form-title')}
                        onChange={handleInput}
                        required
                    />
                    <textarea
                        name="content"
                        value={formValues.content}
                        className={cx('form-content')}
                        onChange={handleInput}
                        required
                    />
                    <select
                        name="category"
                        value={formValues.category}
                        className={cx('form-category')}
                        onChange={handleInput}
                        required
                    >
                        <option>------</option>
                        <option>red</option>
                        <option>yellow</option>
                        <option>green</option>
                    </select>
                    <select
                        name="status"
                        value={formValues.status === '' ? data?.status : formValues.status}
                        className={cx('form-status')}
                        onChange={handleInput}
                        required
                    >
                        <option>------</option>
                        <option>to do</option>
                        <option>in progress</option>
                        <option>completed</option>
                    </select>

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

export default Item;
