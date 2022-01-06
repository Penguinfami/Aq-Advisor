const OptionSelect = (props) => {
    return (
        <div className={`selectOption`}>
            <select className={props.className} defaultValue={props.selected} onChange={(e) => props.onChange(e)} name={props.name} id={props.name} size={props.size ? props.size : 1}>
                { props.options.map((option, index) => 
                    <option value={option.name} key={index} name={option.name} >{option.name}</option>
                )}
            </select>
        </div>
    )
}

export default OptionSelect
