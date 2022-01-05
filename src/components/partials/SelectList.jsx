import Button from './Button';

const SelectList = (props) => {

    return (
        <div name={props.name} className={`selectList ${props.className}`}>
            <div className="selectListItems">
            { props.items.map((item) => 
                <Button key={item.value} onClick={() => props.selectItem(item)} className={`selectListItem ${props.selected ? props.selected.value === item.value ? 'selectedListItem' : '' : ''}`} title={item.name}/>
            )}
            </div>
        </div>
    )
}

export default SelectList
