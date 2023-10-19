import { useRef, useState, useEffect } from 'react';  
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { Schema, FormHeader, FormField } from './types';



const Header = ({ title, description }: FormHeader) => {
    return (
        <header style={{marginBottom: '12px'}}>
            <h2>{title}</h2>
            <i>{description}</i>
        </header>
    );
}

const Field = ({ handleChange, field }: {handleChange: Function, field: FormField}) => {
    const { type, label, name, options, validation } = field;
    let required: boolean = Boolean(validation && validation.required);
    let input;
    switch (type) {
        case 'text': 
        case 'date':
            input = (<TextField fullWidth type={type} label={label} name={name} id={name} required={required} onChange={handleChange} InputLabelProps={{ shrink: true }}/>);
            break;
        case 'textarea':
            input = (
                <TextField 
                id={name}
                name={name}
                label={label}
                multiline
                fullWidth
                rows={6}
                required={required}
                //onBlur={() => {  }}
                onChange={handleChange}
                //defaultValue="enter query"
                />
            );
            break;
        case 'select':
            input = (
                <FormControl fullWidth>
                    <InputLabel id="select-label">{label}</InputLabel>
                    <Select labelId="select-label"
                        id={name}
                        name={name} required={required} onChange={handleChange}
                    >
                    {
                        options?.map( ({label, value}: { label: string, value: string}) => (
                            <MenuItem value={value}>{label}</MenuItem>
                        ))
                    }
                    </Select>
                    </FormControl>
            )
            break;
        default: 
            return null;
        }

        return (
            <div style={{margin: '22px 0'}}>
                {input}
            </div>
        )
}



export default function FormBuilder ({schema}: {schema: Schema}) {
    const formRef = useRef(null);
    const [triggerFieldMap, setTriggerFieldMap] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        if (schema.conditionalRules) {
            setTriggerFieldMap(
               schema.conditionalRules.reduce( (acc, cur) => {
                    acc[cur.triggerField] = cur;
                    return acc;
               }, {})
            )
        }
    }, [schema])


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target.elements);

        const results = Array.from(e.target.elements).map( elem => (
            {
                name: elem.name,
                value: elem.value,
            }
        ));
        console.log({results});
    }

    const handleChange = e => {
        if (triggerFieldMap[e.target.name]) {
            const rule = triggerFieldMap[e.target.name]
            const targetElement = formRef.current.elements[rule.targetField];
            
            rule.equalTo.includes(e.target.value) ? 
                targetElement.setAttribute(rule.attribute, true) : 
                targetElement.removeAttribute(rule.attribute);
        }

        //check if all required field have values and set state if changed
        const currentValidity = formRef.current.checkValidity();
        (currentValidity !== isFormValid) && setIsFormValid(currentValidity);
    }

    const { header, fields }: Schema = schema || {};
    
    return schema ? (
        <div>
            <Header {...header}/>
            <form onSubmit={handleSubmit} ref={formRef}>
                {
                    fields && fields.map( field => (
                        <Field handleChange={handleChange} field={field}/>
                    ))
                }
                <Button type="submit" variant="contained" fullWidth disabled={!isFormValid} style={{marginTop: '18px'}}>submit</Button>
            </form>
        </div>
    ) : null;
}
