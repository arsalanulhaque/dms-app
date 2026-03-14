import { useEffect, useState } from "react";
import FetchData from '../../Hooks/FetchData'
import Select from 'react-select'
import $ from "jquery";

// Simple in-memory cache to avoid refetching the same endpoint repeatedly
const dropdownCache = {};

function Dropdown(props) {
    const [data, setData] = useState([])

    const formatOptionLabel = ({ label, labelSchool }) => (
        <div style={{ display: "flex", alignItems: "center" }}>
            <span>{label}</span>
            {labelSchool && (
                <span style={{ marginLeft: 12, color: "#888", fontSize: "0.95em" }} aria-label="School Name">
                    {labelSchool}
                </span>
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

        // If we already have cached options for this API, reuse them
        if (dropdownCache[props.api]) {
            setData(dropdownCache[props.api]);
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
                    dropdownCache[props.api] = options;
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