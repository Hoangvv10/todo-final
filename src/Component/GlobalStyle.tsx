import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    font-size: 62.5%;
}

body {
    font-family: 'Climate Crisis', cursive;
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 1.6rem;
    line-height: 1.5;
    text-rendering: optimizespeed;
    color: var(--text-color);
    overflow-y: overlay;
}

html ::-webkit-scrollbar {
    width: 6px;
}

button,
input {
    outline: none;
    border: none;
    background-color: transparent;
}

a {
    color: #000;
    text-decoration: none;

    &:hover {
        color: #000;
        text-decoration: underline;
    }
}

ul {
    list-style: none;
}
`;

export default GlobalStyle;
