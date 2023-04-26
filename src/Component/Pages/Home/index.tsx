import styles from './Home.module.scss';
import { TTaskItems } from '../../TSType';
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

    const [data, setData] = useState<TTaskItems[]>([]);
    const [listId, setListId] = useState<number[]>([]);
    const [addItem, setAddItem] = useState<boolean>(false);
    const [isHeader, setIsHeader] = useState<boolean>(true);

    useEffect(() => {
        new Promise(async (resolve, reject) => {
            try {
                const response = await axios({
                    url: 'http://localhost:4000/data',
                    method: 'get',
                });
                resolve(response);
                if (response.status === 200) {
                    const list = response.data.filter((item: TTaskItems) => item.userId === userId);
                    userId === 1 ? setData(response.data) : setData(list);
                } else {
                    // throw error;
                }
            } catch (error) {
                reject(error);
            }
        });
    }, [userId]);

    useEffect(() => {
        new Promise(async (resolve, reject) => {
            try {
                const response = await axios({
                    url: 'http://localhost:4000/user',
                    method: 'get',
                });
                resolve(response);
                if (response.status === 200) {
                    const list: number[] = [];
                    response.data.forEach((item: TTaskItems) => list.push(item.id));
                    setListId(list);
                } else {
                    // throw error;
                }
            } catch (error) {
                reject(error);
            }
        });
    }, [userId]);

    const handHeader = (value: boolean) => {
        setIsHeader(value);
    };

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
                        {isHeader && (
                            <>
                                <div className={cx('id')}>Id</div>
                                {userId === 1 && <div className={cx('id')}>UserId</div>}
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
                                )}{' '}
                            </>
                        )}
                    </div>
                    <div className={cx('body')}>
                        {data.map((item, index) => (
                            <Item
                                item={item}
                                index={index}
                                key={item.id}
                                handleDelete={handleDelete}
                                userId={userId}
                                handHeader={handHeader}
                                listId={listId}
                            />
                        ))}
                        {addItem && (
                            <Item
                                item={initItem}
                                index={data.length}
                                handleDelete={handleDelete}
                                isAdd={true}
                                handleAdd={handleAdd}
                                userId={userId}
                                listId={listId}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
