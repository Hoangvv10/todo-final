import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSquareXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { memo, useState } from 'react';
import moment from 'moment';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';

import { TTaskItems } from '../TSType';
import styles from './Item.module.scss';
import { Category, Status } from '../TSType';
import { DATA_API_URL } from '../APIs';
import { toast } from 'react-toastify';
import usePutAxios from '../axiosHooks/usePutAxios';
import usePostAxios from '../axiosHooks/usePostAxios';

const cx = classNames.bind(styles);

interface Props {
    item: TTaskItems;
    index: number;
    handleDelete: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
    isAdd?: boolean;
    handleAdd?: (value: TTaskItems | null) => void;
    userId: number;
    listId: number[];
}

interface FormValues {
    title: string;
    category: Category | '';
    status: Status | '';
    content: string;
}

const Item: React.FC<Props> = ({ item, index, handleDelete, isAdd, handleAdd, userId, listId }) => {
    const [data, setData] = useState<TTaskItems | undefined>(item);
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

    const initValue: FormValues = {
        title: '',
        category: '',
        status: '',
        content: '',
    };
    const [formValues, setFormValues] = useState<FormValues>(initValue);
    const [curId, setCurId] = useState<TTaskItems['userId']>(0);

    const handleOpenEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
        setIsEditOpen(true);
    };

    const putData = usePutAxios;
    const postData = usePostAxios;

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

        if (name === 'idUser') {
            setCurId(Number(e.target.value));
        } else {
            setFormValues({
                ...formValues,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsEditOpen(false);
        const editId = Number(curId);

        const addData = {
            content: formValues.content,
            title: formValues.title,
            status: formValues.status,
            category: formValues.category,
            userId: userId === 1 ? editId : userId,
            createAt: moment(new Date()).format('DD/MM/YYYY'),
            updateAt: moment(new Date()).format('DD/MM/YYYY'),
        };

        const editData: TTaskItems = {
            content: formValues.content === '' && data ? data?.content : formValues.content,
            title: formValues.title === '' && data ? data?.title : formValues.title,
            status: formValues.status === '' && data ? data?.status : formValues.status,
            category: formValues.category === '' && data ? data?.category : formValues.category,
            userId: curId === 0 && data ? data?.userId : curId,
            createAt: item.createAt,
            updateAt: moment(new Date()).format('DD/MM/YYYY'),
            id: item.id,
        };
        if (!isAdd) {
            const result = await putData<TTaskItems>(DATA_API_URL + item.id, editData);
            if (result.data) {
                setData(result.data);
            } else {
                toast.error(`Error: ${result.error?.message}`, {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } else {
            const result = await postData<TTaskItems>(DATA_API_URL, addData);
            if (result.data) {
                if (handleAdd) handleAdd(result.data);
            } else {
                toast.error(`Error: ${result.error?.message}`, {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        }
    };

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
            >
                <div className={cx('inner')}>
                    {userId === 1 && (
                        <div className={cx('form-category')}>
                            <select
                                name="idUser"
                                value={curId === 0 ? data?.userId : curId}
                                onChange={handleInput}
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

export default memo(Item);
