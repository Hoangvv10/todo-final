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
import ItemForm from '../ItemForm';

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
            <ItemForm
                isItem={true}
                isEditOpen={isEditOpen}
                isAdd={isAdd}
                userId={userId}
                curId={curId}
                itemData={data}
                listId={listId}
                handleItemInput={handleInput}
                handleCloseEdit={handleCloseEdit}
                formValues={formValues}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default memo(Item);
