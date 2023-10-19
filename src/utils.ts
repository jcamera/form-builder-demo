import { Schema } from './types';

const labelMap: {[key: string]: string} = {
    reason_select: 'Reason for Enquiry',
    payslip_date: 'Date of Payslip',
    query: 'Query',
    incorrect_pay: 'Incorrect Pay',
    missing_expense: 'Missing Expense',
    change_bank_details: 'Change of Bank Details',
    change_address: 'Change of Address',
    other: 'Other',
}


export const formatHTMLTable = (data: Array<{name: string, value: string}>, schema: Schema): string => 
`
<body>
    <h4>${schema?.header?.title}</h4>
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
        <tr>
            <td align="center" valign="top">
                <table border="0" cellpadding="20" cellspacing="0" width="600" id="emailContainer">
  ${
    data?.map( rowData => rowHTML(rowData)).join(' ')
  }
                </table>
            </td>
        </tr>
    </table>
</body>
`;

const rowHTML = (rowData: {name: string, value: string}) => `
<tr>
    <td valign="top">
        ${labelMap[rowData.name]}
    </td>
    <td valign="top">
        ${rowData.value}
    </td>
</tr>
`
