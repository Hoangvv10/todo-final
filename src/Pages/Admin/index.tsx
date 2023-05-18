import styles from '../Home/Home.module.scss';
import { TTaskItems, TUser } from '../../TSType';
import UserItem from '@/Component/UserItem';

import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { DATA_API_URL, USER_API_URL } from '@constants/APIsContants';
import useGetAxios from '@axiosHooks/useGetAxios';
import useDeleteAxios from '@axiosHooks/useDeleteAxios';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const Admin: React.FC = () => {
    const { data } = useGetAxios<TUser[]>(USER_API_URL);
    const { data: itemsData } = useGetAxios<TTaskItems[]>(DATA_API_URL);

    const delData = useDeleteAxios;

    const [list, setList] = useState<TUser[]>([]);
    const [delId, setDelId] = useState<number>(0);

    useEffect(() => {
        data && setList(data);
    }, [data]);

    const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        const target = e.target as HTMLElement;
        setList(list.filter((item) => item.id !== Number(target.dataset.index)));
        setDelId(Number(target.dataset.index));

        const result = delData(USER_API_URL + target.dataset.index);
        if (!!result) {
            toast.success('User deleted successfully', {
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

    useEffect(() => {
        if (!!itemsData) {
            const delList = itemsData.filter((item: TTaskItems) => item.userId === delId);
            delList.map((x: TTaskItems) => {
                delData(DATA_API_URL + x.id);
            });
        }
    }, [itemsData, delId]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('table')}>
                    <div className={cx('header')}>
                        <>
                            <div className={cx('id')}>Id</div>
                            <div className={cx('name')}>Username</div>
                            <div className={cx('email')}>Email</div>
                            <div className={cx('password')}>Password</div>
                            <div className={cx('date')}>Create at</div>
                            <div className={cx('date')}>Update at</div>
                        </>
                    </div>
                    <div className={cx('body')}>
                        {list.map((item, index) => (
                            <UserItem prop={item} key={item.id} index={index} handleDelete={handleDelete} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
