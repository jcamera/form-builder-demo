import { useRef, useState, useEffect } from 'react';  

interface Header {
    title: string;
    description?: string;
};

type FieldType = 'text' | 'select' | 'date' | 'textarea';

interface Conditional {
    fieldName: string;
    equalTo: string | Array<string>;
}

interface ConditionalOnRule {
    triggerField: string;
    equalTo?: Array<string>;
    targetField: string;
    attribute: string;
}

interface ValidationOptions {
    required?: boolean | Conditional;
};

type SelectOption = {
    label: string;
    value: string;
};

interface Field {
    type: FieldType;
    label: string;
    name: string;
    options?: Array<SelectOption>;
    validation?: ValidationOptions;
}

interface Schema {
    header: Header;
    fields: Array<Field>;
    conditionalRules: Array<ConditionalOnRule>;
}

const Header = ({ title, description }: Header) => {
    return (
        <header>
            <h1>{title}</h1>
            <i>{description}</i>
        </header>
    );
}

//const Field = ({ type, label, name, options, validation }: Field) => {
const Field = ({ handleChange, field }: {handleChange: Function, field: Field}) => {
    const { type, label, name, options, validation } = field;
    let required: boolean = Boolean(validation && validation.required);
    // if (required && validation.required?.conditionalOn) {
    //     required = getConditionalRequired(validation.required?.conditionalOn);
    // }
    
    //const required: boolean = Boolean(validation && validation.required);

    let input;
    switch (type) {
        case 'text': 
        case 'date':
            input = <input type={type} name={name} id={name} required={required} onChange={handleChange}/>;
            break;
        case 'textarea':
            input = <textarea name={name} id={name} required={required} onChange={handleChange}/>;
            break;
        case 'select':
            input = (
                <select name={name} id={name} required={required} onChange={handleChange}>
                    <option value=''></option>
                    {
                        options?.map( ({label, value}) => (
                            <option value={value}>{label}</option>
                        ))
                    }
                </select>
            );
            break;
        default: 
            return null;
    }   

    return (
        <>
            <label htmlFor={name}>{label}</label>
            <br/>
            {input}
            <br/>
        </>
    )
    
}



export default function FormBuilder ({schema}: {schema: Schema}) {
    console.log('schema: ', schema);

    const formRef = useRef(null);
    //const [triggerFields, setTriggerFields] = useState({});
    const [triggerFieldMap, setTriggerFieldMap] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    console.log({triggerFieldMap});

    useEffect(() => {
        if (schema.conditionalRules) {
            setTriggerFieldMap(
                //schema.conditionalRules.map( rule => rule.triggerField)
            //   const result = schema.conditionalRules.reduce( (acc, cur) => (acc[cur.triggerField] = cur), {})
               schema.conditionalRules.reduce( (acc, cur) => {
                    acc[cur.triggerField] = cur;
                    return acc;
               }, {})
               //const result = new Map( schema.conditionalRules.map(rule => []))
                //console.log({result});
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
        console.log('handle change , ', e.target.value);
        console.log('handle change , ', e.target.name);
        if (triggerFieldMap[e.target.name]) {
            const rule = triggerFieldMap[e.target.name]
            const targetElement = formRef.current.elements[rule.targetField];
            
            rule.equalTo.includes(e.target.value) ? 
                targetElement.setAttribute(rule.attribute, true) : 
                targetElement.removeAttribute(rule.attribute);
        }

        console.log('formRef.current.checkValidity() ', formRef.current.checkValidity());
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
                <button type="submit" disabled={!isFormValid}>submit</button>
            </form>
        </div>
    ) : null;
}


//disabled={false}