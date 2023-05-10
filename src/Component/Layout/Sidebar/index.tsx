import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Sidebar.module.scss';
import LoginForm from '../../LoginForm';
import { UserContext } from '../../../store/UserContext';
import { TUser } from '../../TSType';
import { USER_API_URL } from '../../APIs';
import useGetAxios from '../../axiosHooks/useGetAxios';

const cx = classNames.bind(styles);

const Sidebar: React.FC = () => {
    const { userId, setUserId } = useContext(UserContext);
    const { data } = useGetAxios<TUser[]>(USER_API_URL);

    const [userName, setUserName] = useState<string>('');
    const [navActive, setNavActive] = useState<number>(1);

    const navigate = useNavigate();

    const [openLogin, setOpenLogin] = useState<boolean>(false);

    const modalRef = useRef<HTMLDivElement | null>(null);

    const port: string = window.location.pathname;

    const handleOpenLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setOpenLogin(true);
    };

    const handleCloseLogin = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setOpenLogin(false);
        }
    };

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
        if (data && userId !== 0) {
            const user = data.find((i: TUser) => i.id === userId);
            user && setUserName(user.userName);
        }
        setOpenLogin(false);
    }, [userId, data]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('header')}>
                    {userId === 0 ? (
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

                {userId !== 0 && (
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
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
