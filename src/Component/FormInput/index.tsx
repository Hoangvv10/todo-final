import { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './FormInput.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

interface Props {
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id: number;
    name: string;
    type: string;
    placeholder: string;
    errorMessage?: string;
    label?: string;
    pattern?: string;
    required?: boolean;
    autoComplete?: string;
}

const FormInput: React.FC<Props> = (props) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const { label, errorMessage, type, onChange, id, ...inputProps } = props;
    const [inputType, setInputType] = useState<string>('password');

    const handleTypeChange = () => {
        setInputType(inputType === 'text' ? 'password' : 'text');
    };

    return (
        <div
            className={cx({
                'form-input': true,
                'is-focus': isFocused,
            })}
        >
            <label>{label}</label>
            <input
                type={inputProps.name === 'password' ? inputType : type}
                {...inputProps}
                onChange={onChange}
                onFocus={() => {
                    inputProps.name === 'confirmPassword' && setIsFocused(true);
                }}
                onBlur={() => setIsFocused(true)}
                className={cx('input')}
            />
            {inputProps.name === 'password' && !!inputProps.value && (
                <div className={cx('toggle-password')} onClick={handleTypeChange}>
                    {inputType === 'password' ? (
                        <FontAwesomeIcon icon={faEye} />
                    ) : (
                        <FontAwesomeIcon icon={faEyeSlash} />
                    )}
                </div>
            )}
            <span className={cx('error-message')}>{errorMessage}</span>
        </div>
    );
};

export default FormInput;
