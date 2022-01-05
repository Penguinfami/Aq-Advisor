import TitleHeader from '../partials/TitleHeader'
import Button from '../partials/Button';
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = (props) => {

    const nameInputBox = useRef()

    const navigate = useNavigate();


    return (
        <div id="homepage" className="page">
            <TitleHeader/>
            <span className="subheading">Welcome to My AqAdvisor!</span>
            <input ref={nameInputBox} onChange={() => props.updateInput(nameInputBox.current.value, props.name, props.setName)} className="nameInput" type="text" placeholder={ props.name !== '' ? props.name : `Enter your name...`}/>
            <Button onClick={() => props.onNext().then(navigate(props.nextPage))} className="nextButton" title="Next"/>
        </div>
    )
}

export default Home
