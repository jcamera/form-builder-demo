
export interface FormHeader {
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

export interface FormField {
    type: FieldType;
    label: string;
    name: string;
    options?: Array<SelectOption>;
    validation?: ValidationOptions;
}

export interface Schema {
    header?: FormHeader;
    fields?: Array<FormField>;
    conditionalRules?: Array<ConditionalOnRule>;
};