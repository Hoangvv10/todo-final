import styles from '../Home/Home.module.scss';
import { User } from '../../TSType';
import UserItem from '../../UserItem';

import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

const Admin: React.FC = () => {
    const [data, setData] = useState<User[]>([]);

    useEffect(() => {
        new Promise(async (resolve, reject) => {
            try {
                const response = await axios({
                    url: 'http://localhost:4000/user',
                    method: 'get',
                });
                resolve(response);
                if (response.status === 200) {
                    setData(response.data);
                } else {
                    // throw error;
                }
            } catch (error) {
                reject(error);
            }
        });
    }, []);

    const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        const target = e.target as HTMLElement;
        setData(data.filter((item) => `${item.id}` != target.dataset.index));

        axios
            .delete(`http://localhost:4000/user/${target.dataset.index}`)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('table')}>
                    <div className={cx('header')}>
                        <div className={cx('id')}>Index</div>
                        <div className={cx('name')}>Username</div>
                        <div className={cx('email')}>Email</div>
                        <div className={cx('password')}>Password</div>
                        <div className={cx('date')}>Create at</div>
                        <div className={cx('date')}>Update at</div>
                    </div>
                    <div className={cx('body')}>
                        {data.map((item, index) => (
                            <UserItem prop={item} key={item.id} index={index} handleDelete={handleDelete} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
