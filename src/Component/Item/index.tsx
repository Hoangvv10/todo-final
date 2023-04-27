import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSquareXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';

import { TTaskItems } from '../TSType';
import styles from './Item.module.scss';
import { Category, Status } from '../TSType';

const cx = classNames.bind(styles);

interface Props {
    item: TTaskItems;
    index: number;
    handleDelete: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
    isAdd?: boolean;
    handleAdd?: (value: TTaskItems | null) => void;
    userId: number;
    listId?: number[];
    handHeader?: (value: boolean) => void;
}

interface FormValues {
    title: string;
    category: Category | '';
    status: Status | '';
    content: string;
}

interface userIdValue {
    idUser: number;
}

const Item: React.FC<Props> = ({ item, index, handleDelete, isAdd, handleAdd, userId, listId, handHeader }) => {
    const [data, setData] = useState<TTaskItems | undefined>();
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const initValue: FormValues = {
        title: '',
        category: '',
        status: '',
        content: '',
    };
    const [formValues, setFormValues] = useState<FormValues>(initValue);
    const [curId, setCurId] = useState<userIdValue>({
        idUser: 0,
    });

    const formRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        setData(item);
    }, [item]);

    const handleOpenEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
        setIsEditOpen(true);
        if (handHeader && index === 0) handHeader(false);
    };

    const handleCloseEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault();
        setIsEditOpen(false);
        if (handleAdd) handleAdd(null);
        if (handHeader) handHeader(true);
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

    const handleIdInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        setCurId({
            ...curId,
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
        if (handHeader) handHeader(true);
    };

    useEffect(() => {
        if (isSubmit) {
            const { idUser } = curId;

            const addData = {
                content: formValues.content,
                title: formValues.title,
                status: formValues.status,
                category: formValues.category,
                userId: userId !== 1 ? userId : idUser,
                createAt: moment(new Date()).format('DD/MM/YYYY'),
                updateAt: moment(new Date()).format('DD/MM/YYYY'),
            };

            const editData: TTaskItems = {
                content: formValues.content === '' && data ? data?.content : formValues.content,
                title: formValues.title === '' && data ? data?.title : formValues.title,
                status: formValues.status === '' && data ? data?.status : formValues.status,
                category: formValues.category === '' && data ? data?.category : formValues.category,
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
        <div
            className={cx({
                item: true,
                'is-first': (index === 0 && isEditOpen) || !!handleAdd,
            })}
        >
            <div className={cx('id')}>{index + 1}</div>
            {userId === 1 && <div className={cx('id')}>{data?.userId}</div>}
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
                ref={formRef}
            >
                <div className={cx('inner')}>
                    {userId === 1 && (
                        <div className={cx('form-category')}>
                            <select
                                name="idUser"
                                value={curId.idUser === 0 ? data?.userId : curId.idUser}
                                onChange={handleIdInput}
                                required
                            >
                                <option></option>
                                <>
                                    {listId?.map((item, index) => (
                                        <option key={index}>{item}</option>
                                    ))}
                                </>
                            </select>
                            <label className={cx('label')}>User id</label>
                        </div>
                    )}
                    <div className={cx('form-title')}>
                        <textarea
                            name="title"
                            value={formValues.title === '' ? data?.title : formValues.title}
                            onChange={handleInput}
                            required
                        />
                        <label className={cx('label')}>title</label>
                    </div>
                    <div className={cx('form-content')}>
                        <textarea
                            name="content"
                            value={formValues.content === '' ? data?.content : formValues.content}
                            onChange={handleInput}
                            required
                        />
                        <label className={cx('label')}>content</label>
                    </div>
                    <div className={cx('form-category')}>
                        <select
                            name="category"
                            value={formValues.category === '' ? data?.category : formValues.category}
                            onChange={handleInput}
                            required
                        >
                            <option></option>
                            <option>red</option>
                            <option>yellow</option>
                            <option>green</option>
                        </select>
                        <label className={cx('label')}>category</label>
                    </div>
                    <div className={cx('form-status')}>
                        <select
                            name="status"
                            value={formValues.status === '' ? data?.status : formValues.status}
                            onChange={handleInput}
                            required
                        >
                            <option></option>
                            <option>to do</option>
                            <option>in progress</option>
                            <option>completed</option>
                        </select>
                        <label className={cx('label')}>status</label>
                    </div>

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
