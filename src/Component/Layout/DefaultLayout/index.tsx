import styles from './DefaultLayout.module.scss';
import Sidebar from '../Sidebar';

import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface LayoutProps {
    children: React.ReactNode;
}

const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Sidebar />
                <div className={cx('children')}>{children}</div>
            </div>
        </div>
    );
};

export default DefaultLayout;
