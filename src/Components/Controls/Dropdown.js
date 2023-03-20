import { useEffect, useState, useContext } from "react";
import FetchData from '../../Hooks/FetchData'
import SessionContext from '../../Context/SessionContext'
import Select from 'react-select'
import $ from "jquery";

function Dropdown(props) {
    const [data, setData] = useState([])
    const { session } = useContext(SessionContext);

    let formatOptionLabel = ({ value, label, labelSchool }) => (
        <div style={{ display: "flex" }}>
            <div>{label}</div>
            <div style={{ marginLeft: "10px", color: "#ccc" }}>
                {labelSchool}
            </div>
        </div>
    );

    useEffect(() => {
        $(function () {
            $('div.form-control').removeClass("form-control")
        })

        let options = [{ value: -1, label: 'Select' }]

        FetchData(session.isAppDeveloper === true ? props.api : `${props.api}/${session.schoolID}`, 'get', null, (result) => {
            if (result.error === false) {
                let res = result
                res.data.map(obj => {
                    if (props.api === 'previlige')
                        options.push({ value: obj[props.keyField], label: obj[props.valueField], labelSchool: obj.SchoolName })
                    else
                        options.push({ value: obj[props.keyField], label: obj[props.valueField] })

                })
                setData(options)
            }
        })
    }, [])

    const defaultValue = (options, value) => {
        return options ? options.find(option => option.value === value) : ''
    }

    return (
        <div>
            <Select className="form-control"
                options={data}
                value={defaultValue(data, props.selectedValue)}
                {...props.api === 'previlige' ? formatOptionLabel = { formatOptionLabel } : ''}
                onChange={e => { props.onChange(e); }}>
            </Select>
        </div>)
}

export default Dropdown;