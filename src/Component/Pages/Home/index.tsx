import styles from './Home.module.scss';
import { TaskItems } from '../../TSType';
import { UserContext } from '../../../store/UserContext';
import Item from '../../Item';

import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const Home: React.FC = () => {
    const { userId } = useContext(UserContext);

    const [data, setData] = useState<TaskItems[]>([]);
    const [addItem, setAddItem] = useState<boolean>(false);

    useEffect(() => {
        new Promise(async (resolve, reject) => {
            try {
                const response = await axios({
                    url: 'http://localhost:4000/data',
                    method: 'get',
                });
                resolve(response);
                if (response.status === 200) {
                    const list = response.data.filter((item: TaskItems) => item.userId === userId);
                    console.log(list);

                    userId === 1 ? setData(response.data) : setData(list);
                } else {
                    // throw error;
                }
            } catch (error) {
                reject(error);
            }
        });
    }, [userId]);

    const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        const target = e.target as HTMLElement;
        setData(data.filter((item) => `${item.id}` != target.dataset.index));

        axios
            .delete(`http://localhost:4000/data/${target.dataset.index}`)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const initItem: TaskItems = {
        category: '',
        content: '',
        createAt: '',
        status: '',
        title: '',
        updateAt: '',
        userId: 0,
        id: data.length,
    };

    const handleAddItem = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        setAddItem(true);
    };

    const handleAdd = (value: TaskItems | null) => {
        setAddItem(false);
        if (value) data.push(value);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('table')}>
                    <div className={cx('header')}>
                        <div className={cx('id')}>Index</div>
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
                        {userId != 0 && (
                            <div className={cx('add-btn')} onClick={handleAddItem}>
                                <FontAwesomeIcon icon={faSquarePlus} />
                            </div>
                        )}
                    </div>
                    <div className={cx('body')}>
                        {data.map((item, index) => (
                            <Item item={item} index={index} key={item.id} handleDelete={handleDelete} userId={userId} />
                        ))}
                        {addItem && (
                            <Item
                                item={initItem}
                                index={data.length}
                                handleDelete={handleDelete}
                                isAdd={true}
                                handleAdd={handleAdd}
                                userId={userId}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
