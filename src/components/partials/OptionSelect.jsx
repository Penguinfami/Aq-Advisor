const OptionSelect = (props) => {
    return (
        <div className={`selectOption ${props.className}`}>
            <select defaultValue={props.selected} onChange={(e) => props.onChange(e)} name={props.name} id={props.name} size={props.size ? props.size : 1}>
                { props.options.map((option) => 
                    <option value={option.value} key={option.name} name={option.name} >{option.name}</option>
                )}
            </select>
        </div>
    )
}

export default OptionSelect
