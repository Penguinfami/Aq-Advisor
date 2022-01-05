import Button from './Button'

const Error = (props) => {
    return (
        <div className="errorMessageBackground modal d-block page">
            <div className="modal-dialog errorDialog">
                <div className="modal-content errorContent">
                    <div className="errorHeading">{props.heading}</div>
                    <div className="errorBody">{props.body}</div>
                    <div className="errorFooter">
                        <Button className="errorMessageClose" title="Close" onClick={props.onClose}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Error
