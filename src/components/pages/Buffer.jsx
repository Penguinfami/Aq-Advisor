import TitleHeader from '../partials/TitleHeader';

const Buffer = (props) => {
    
    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    })

    return (
        <div className = "page">
            <TitleHeader/>
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
