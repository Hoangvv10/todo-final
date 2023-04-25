import { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './FormInput.module.scss';

const cx = classNames.bind(styles);

interface Props {
    value: string;
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
    const { value, onChange, id, name, type, placeholder, errorMessage, label, pattern, required, autoComplete } =
        props;
    return (
        <div
            className={cx({
                'form-input': true,
                'is-focus': isFocused,
            })}
        >
            <label>{label}</label>
            <input
                type={type}
                id={id.toString()}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                pattern={pattern}
                required={required}
                onFocus={() => {
                    name === 'confirmPassword' && setIsFocused(true);
                }}
                onBlur={() => setIsFocused(true)}
                className={cx('input')}
                autoComplete={autoComplete}
            />
            <span className={cx('error-message')}>{errorMessage}</span>
        </div>
    );
};

export default FormInput;
