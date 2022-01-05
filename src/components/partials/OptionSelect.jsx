const OptionSelect = (props) => {
    return (
        <div className={`selectOption ${props.className}`}>
            <select defaultValue={props.selected} onChange={(e) => props.onChange(e)} name={props.name} id={props.name}>
                { props.options.map((option) => 
                    <option value={option.value} key={option.value} name={option.name} >{option.name}</option>
                )}
            </select>
        </div>
    )
}

export default OptionSelect
