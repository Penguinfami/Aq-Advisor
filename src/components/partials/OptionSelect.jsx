const OptionSelect = (props) => {
    return (
        <div className="selectOption">
            <label htmlFor={props.name}>{props.heading}</label>
            <select defaultValue={props.selected} onChange={(e) => props.onChange(e)} name={props.name} id={props.name} placeholder="Huh">
                { props.options.map((option) => 
                    <option value={option.value} key={option.value} name={option.name} >{option.name}</option>
                )}
            </select>
        </div>
    )
}

export default OptionSelect
