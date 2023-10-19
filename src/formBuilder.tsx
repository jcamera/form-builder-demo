import { useRef, useState, useEffect } from 'react';  
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { Schema, FormHeader, FormField, TriggerRule } from './types';
import { formatHTMLTable } from './utils';


const Header = ({ title, description }: FormHeader) => {
    return (
        <header style={{marginBottom: '12px'}}>
            <h2>{title}</h2>
            <i>{description}</i>
        </header>
    );
}

const Field = ({ handleChange, field }: {handleChange: any, field: FormField}) => {
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
                    onChange={handleChange}
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
                            options?.map(({ label, value }: { label: string, value: string }) => (
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
    const [triggerFieldMap, setTriggerFieldMap] = useState<TriggerRule>({});
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        if (schema.conditionalRules) {
            setTriggerFieldMap(
               schema.conditionalRules.reduce( (acc: any, cur) => {
                    acc[cur.triggerField] = cur;
                    return acc;
               }, {})
            )
        }
    }, [schema])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = Array.from((e.target as HTMLFormElement).elements).map( (elem: any) => (
            {
                name: elem.name,
                value: elem.value,
            }
        )).filter( elem => elem.name && elem.value);

        const htmlResult = formatHTMLTable(formData, schema);

        console.log({formData: formData.filter( elem => elem.name && elem.value), htmlResult});
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        
        if (formRef.current) {
            const currentForm: HTMLFormElement | null  = formRef?.current as HTMLFormElement;
            
            if (triggerFieldMap[e.target.name]) {
                const rule = triggerFieldMap[e.target.name];
                if (rule) {
                   // const ruleTarget: string = rule?.targetField
                    const targetElement = currentForm.elements[rule.targetField as any];
                    
                    rule?.equalTo?.includes(e.target.value) ? 
                        targetElement.setAttribute(rule.attribute, "true") : 
                        targetElement.removeAttribute(rule.attribute);
                }
            }

            //check if all required field have values and set state if changed
            const currentValidity = currentForm.checkValidity();
            (currentValidity !== isFormValid) && setIsFormValid(currentValidity);
        }
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
