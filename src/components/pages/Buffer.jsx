import Button from '../partials/Button';
const Buffer = (props) => {
    return (
        <div className = "page">
            <div className="bufferScreen d-block">
                <div className="modal-dialog bufferDialog">
                    <div className="bufferContent modal-content">
                        <div className="modal-body">
                            {props.message}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Buffer
