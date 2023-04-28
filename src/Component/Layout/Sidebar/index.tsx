import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import styles from './Sidebar.module.scss';
import Form from '../../Form';
import { UserContext } from '../../../store/UserContext';

const cx = classNames.bind(styles);

interface DataItem {
    id: number;
}

const Sidebar: React.FC = () => {
    const { userId, setUserId } = useContext(UserContext);
    const [userName, setUserName] = useState<string>('');
    const [navActive, setNavActive] = useState<number>(1);

    const navigate = useNavigate();

    const [openLogin, setOpenLogin] = useState<boolean>(false);

    const modalRef = useRef<HTMLDivElement | null>(null);

    const handleOpenLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setOpenLogin(true);
    };

    const handleCloseLogin = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setOpenLogin(false);
        }
    };

    const port: string = window.location.pathname;

    useEffect(() => {
        switch (port) {
            case '/':
                setNavActive(1);
                break;
            case '/admin':
                setNavActive(2);
                break;
            default:
                break;
        }
    }, [port]);

    const handleLogout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setUserId(0);
        setUserName('');
        userId === 1 && navigate('/');
        localStorage.setItem('userId', '0');
    };

    useEffect(() => {
        if (userId != 0) {
            new Promise(async (resolve, reject) => {
                try {
                    const response = await axios({
                        url: 'http://localhost:4000/user',
                        method: 'get',
                    });
                    resolve(response);
                    if (response.status === 200) {
                        const user = response.data.filter((i: DataItem) => i.id === userId);
                        setUserName(user[0].userName);
                    } else {
                        // throw error;
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }

        userId === 1 && navigate('/');

        setOpenLogin(false);
    }, [userId]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('header')}>
                    {userName === '' ? (
                        <button onClick={handleOpenLogin} className={cx('login')}>
                            Login
                        </button>
                    ) : (
                        <p className={cx('welcome')}>
                            Welcome <span className={cx('user')}>{userName}</span>
                        </p>
                    )}
                </div>
                {userId === 1 && (
                    <ul className={cx('nav-group')}>
                        <li
                            className={cx({
                                nav: true,
                                'nav-active': navActive === 1,
                            })}
                            onClick={() => {
                                navigate('/');
                            }}
                        >
                            <FontAwesomeIcon icon={faHouse} />
                            <span className={cx('nav-text')}>Projects</span>
                        </li>
                        <li
                            className={cx({
                                'nav-active': navActive === 2,
                                nav: true,
                            })}
                            onClick={() => {
                                navigate('/admin');
                            }}
                        >
                            <FontAwesomeIcon icon={faUser} />
                            <span className={cx('nav-text')}>Users</span>
                        </li>
                    </ul>
                )}

                {userName != '' && (
                    <button className={cx('log-out')} onClick={handleLogout}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        <p>Log out</p>
                    </button>
                )}
            </div>

            <div
                className={cx({
                    modal: true,
                    'is-open': openLogin,
                })}
                onClick={handleCloseLogin}
            >
                <div className={cx('modal-wrapper')}>
                    <div className={cx('modal-inner')} ref={modalRef}>
                        <Form />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
