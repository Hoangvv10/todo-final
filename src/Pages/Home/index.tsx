import styles from './Home.module.scss';
import { TTaskItems, TUser } from '@/TSType';
import { UserContext } from '@/store/UserContext';
import Item from '@/Component/Item';
import { DATA_API_URL, USER_API_URL } from '@constants/APIsContants';

import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import useDeleteAxios from '@axiosHooks/useDeleteAxios';
import useGetAxios from '@axiosHooks/useGetAxios';
import { toast } from 'react-toastify';
import { ADMIN_ID } from '@constants/contants';

const cx = classNames.bind(styles);

const Home: React.FC = () => {
    const { userId } = useContext(UserContext);

    const [data, setData] = useState<TTaskItems[]>([]);
    const [listId, setListId] = useState<number[]>([]);
    const [addItem, setAddItem] = useState<boolean>(false);

    const delData = useDeleteAxios;

    const { data: dataUsers } = useGetAxios<TUser[]>(USER_API_URL);
    const { data: dataItems } = useGetAxios<TTaskItems[]>(DATA_API_URL);

    const initItem: TTaskItems = {
        category: '',
        content: '',
        createAt: '',
        status: '',
        title: '',
        updateAt: '',
        userId: 0,
        id: data.length,
    };

    useEffect(() => {
        if (dataItems) {
            const list = dataItems.filter((item: TTaskItems) => item.userId === Number(userId));
            userId === ADMIN_ID ? setData(dataItems) : setData(list);
        }
    }, [userId, dataItems]);

    useEffect(() => {
        const list: number[] = [];
        !!dataUsers &&
            dataUsers.forEach((item: TUser) => {
                item.id && list.push(item.id);
            });
        setListId(list);
    }, [dataUsers]);

    const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        const target = e.target as HTMLElement;
        setData(data.filter((item) => `${item.id}` !== target.dataset.index));

        const result = delData(DATA_API_URL + target.dataset.index);
        if (!!result) {
            toast.success('Task deleted successfully', {
                position: 'top-right',
                autoClose: 2500,
            });
        } else {
            toast.error(`Error`, {
                position: 'top-right',
                autoClose: 2500,
            });
        }
    };

    const handleAddItem = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        setAddItem(true);
    };

    const handleAdd = (value: TTaskItems | null) => {
        setAddItem(false);
        if (value) data.push(value);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('table')}>
                    <div className={cx('header')}>
                        <>
                            <div className={cx('id')}>Id</div>
                            {userId === ADMIN_ID && <div className={cx('id')}>UserId</div>}
                            <div className={cx('title')}>Title</div>
                            <div className={cx('content')}>Content</div>
                            <div className={cx('time')}>Time</div>
                            <div
                                className={cx({
                                    category: true,
                                })}
                            >
                                Category
                            </div>
                            <div className={cx('status')}>Status</div>
                            {userId !== 0 && (
                                <div className={cx('add-btn')} onClick={handleAddItem}>
                                    <FontAwesomeIcon icon={faSquarePlus} />
                                </div>
                            )}
                        </>
                    </div>
                    <div className={cx('body')}>
                        {addItem && (
                            <Item
                                item={initItem}
                                index={data.length}
                                handleDelete={handleDelete}
                                isAdd={true}
                                handleAdd={handleAdd}
                                userId={userId}
                                listId={!!listId && listId}
                            />
                        )}
                        {data.map((item, index) => (
                            <Item
                                item={item}
                                index={index}
                                key={item.id}
                                handleDelete={handleDelete}
                                userId={userId}
                                listId={!!listId && listId}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
