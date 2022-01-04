import { Link } from 'react-router-dom'

const Button = (props) => {
    return (
            <button className={`button ${props.className}`} onClick={props.onClick}>
                {props.title}
            </button>

    )
}

export default Button
