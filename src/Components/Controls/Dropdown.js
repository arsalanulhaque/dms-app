import { useEffect, useState } from "react";

function Dropdown(props) {
    const [data, setData] = useState([])
    const [selectedValue, setSelectedValue] = useState([])

    useEffect(() => {
        fetch(props.api).then((result) => {
            result.json().then((result) => {
                let res = result
                let options = [{ key: -1, value: 'Select' }]
                res.data.map(obj => {
                    options.push({ key: obj[props.keyField], value: obj[props.valueField] })
                })
                setData(options)
                if (props.selectedValue !== undefined) {
                    setSelectedValue(props.selectedValue)
                }
            })
        })
    }, [])

    const handleChange = (e) => {
        props.onChange(e)
        setSelectedValue(e.target.value)
    }

    return (
        <div>
            <select className="form-control" value={selectedValue} onChange={e => handleChange(e)}>
                {
                    data.map((obj) => <option id={obj.key} key={obj.key} value={obj.value}>{obj.value}</option>)
                }
            </select>
        </div>)
}

export default Dropdown;