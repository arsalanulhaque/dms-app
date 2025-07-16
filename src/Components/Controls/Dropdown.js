import { useEffect, useState, } from "react";
import FetchData from '../../Hooks/FetchData'
import Select from 'react-select'
import $ from "jquery";

function Dropdown(props) {
    const [data, setData] = useState([])

    const formatOptionLabel = ({ value, label, labelSchool }) => (
        <div style={{ display: "flex" }}>
            <div>{label}</div>
            {labelSchool && (
                <div style={{ marginLeft: "10px", color: "#ccc" }}>
                    {labelSchool}
                </div>
            )}
        </div>
    );

    useEffect(() => {
        $(function () {
            $('div.form-control').removeClass("form-control")
        })

        if (!props.api) {
            setData([{ value: -1, label: 'Select School First' }]);
            return;
        }

        let options = [{ value: -1, label: 'Select' }]
        
        FetchData(props.api, 'get', null, (response) => {
            try {
                // Handle different response structures
                const responseData = response?.data || response;
                if (!responseData) {
                    console.error('No data in response:', response);
                    return;
                }

                // If response is an array, use it directly
                const dataArray = Array.isArray(responseData) ? responseData : responseData.data;
                
                if (Array.isArray(dataArray)) {
                    dataArray.forEach(obj => {
                        if (props.keyField === 'PreviligeID') {
                            options.push({ 
                                value: obj[props.keyField], 
                                label: obj[props.valueField],
                                labelSchool: obj.SchoolName 
                            })
                        } else {
                            options.push({ 
                                value: obj[props.keyField], 
                                label: obj[props.valueField] 
                            })
                        }
                    });
                    setData(options);
                } else {
                    console.error('Response data is not an array:', dataArray);
                    setData([{ value: -1, label: 'Error loading options' }]);
                }
            } catch (error) {
                console.error('Error processing dropdown data:', error);
                setData([{ value: -1, label: 'Error loading options' }]);
            }
        })
    }, [props.api, props.keyField, props.valueField]) // Add all used props as dependencies

    const defaultValue = (options, value) => {
        return options ? options.find(option => option.value === value) : ''
    }

    return (
        <div>
            <Select 
                className="form-control"
                options={data}
                value={defaultValue(data, props.selectedValue)}
                formatOptionLabel={props.keyField === 'PreviligeID' ? formatOptionLabel : undefined}
                onChange={e => { props.onChange(e); }}
                isDisabled={props.disabled}
                placeholder="Select..."
            />
        </div>
    )
}

export default Dropdown;