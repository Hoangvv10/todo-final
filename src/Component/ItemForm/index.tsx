import { Category, Status, TTaskItems, TUser } from '../../TSType';
import styles from '../Item/Item.module.scss';

import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { memo } from 'react';
import { ADMIN_ID } from '../StaticContants';

const cx = classNames.bind(styles);

interface ItemFormValues {
    title?: string;
    category?: string;
    status?: string;
    content?: string;
    userName?: string;
    email?: string;
}

interface Props {
    isItem: boolean;
    isEditOpen: boolean;
    isAdd?: boolean;
    userId?: number;
    curId?: number;
    itemData?: TTaskItems;
    userData?: TUser;
    listId?: number[];
    handleItemInput?: (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLSelectElement>,
    ) => void;
    handleUserInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCloseEdit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    formValues: ItemFormValues;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ItemForm: React.FC<Props> = (props) => {
    const {
        isItem,
        isEditOpen,
        isAdd,
        userId,
        curId,
        itemData,
        userData,
        listId,
        handleItemInput,
        handleUserInput,
        handleCloseEdit,
        formValues,
        handleSubmit,
    } = props;

    return (
        <form
            className={cx({
                'edit-form': true,
                'is-open': isEditOpen || isAdd,
            })}
            onSubmit={handleSubmit}
        >
            <div className={cx('inner')}>
                {isItem ? (
                    <div className={cx('container')}>
                        {userId === ADMIN_ID && (
                            <div className={cx('form-category')}>
                                <select
                                    name="idUser"
                                    value={curId === 0 ? itemData?.userId : curId}
                                    onChange={handleItemInput}
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
                                value={formValues.title === '' ? itemData?.title : formValues.title}
                                onChange={handleItemInput}
                                required
                            />
                            <label className={cx('label')}>title</label>
                        </div>
                        <div className={cx('form-content')}>
                            <textarea
                                name="content"
                                value={formValues.content === '' ? itemData?.content : formValues.content}
                                onChange={handleItemInput}
                                required
                            />
                            <label className={cx('label')}>content</label>
                        </div>
                        <div className={cx('form-category')}>
                            <select
                                name="category"
                                value={formValues.category === '' ? itemData?.category : formValues.category}
                                onChange={handleItemInput}
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
                                value={formValues.status === '' ? itemData?.status : formValues.status}
                                onChange={handleItemInput}
                                required
                            >
                                <option></option>
                                <option>to do</option>
                                <option>in progress</option>
                                <option>completed</option>
                            </select>
                            <label className={cx('label')}>status</label>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={cx('form-name')}>
                            <input
                                type="text"
                                name="userName"
                                value={formValues.userName === '' ? userData?.userName : formValues.userName}
                                onChange={handleUserInput}
                            />
                            <label className={cx('label')}>User name</label>
                        </div>
                        <div className={cx('form-email')}>
                            <input
                                type="text"
                                name="email"
                                value={formValues.email === '' ? userData?.email : formValues.email}
                                onChange={handleUserInput}
                            />
                            <label className={cx('label')}>Email</label>
                        </div>
                    </>
                )}
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
    );
};

export default memo(ItemForm);
