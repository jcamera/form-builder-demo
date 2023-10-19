# Form Builder Demo

## setup

 - git clone to local 
 - cd into dir
 - run `npm install`
 - run `npm run dev`
 - view `http://localhost:5173/` in browser

 ---

 ## considerations for next steps 

If this were to be continued...

Assuming we will want to serve different form schemas for different clients, we would create a back-end form service and some data store for the JSON form schema. The data store would probably take the form of document-based storage (like mongodb) or some kind of key-value store (like s3). 


Of course we would need some kind of authentication and authorization. User credentials may be passed with a JWT, so that appropriate schemas are served. 

The form schema may easily be extended with different types of fields and different validations. We can also add a variety of conditional rules - here we added just one kind of rule, to turn on a field attribute on when another field is equal to one of the given values.  
A more advanced version of this could allow nested schemas, or lists of data elements pulled from elsewhere. If schemas reference other schemas or lists, the final form schema would be generated in the form server, ready for the UI to process. 
We may also allow for client-specific styles, including color schemes and logos, by creating placeholders for customizable elements in the render code.

For client side maintainability we could separate out the various form field components and make it so the FormBuilder has no dependencies on component libraries outside React (like Material UI) or style engines. In this example we are primarily relying on native form elements here rather than any form library, which makes it more future-proof. 

For testing the FormBuilder as it evolves, this could be a good use case for jest snapshot tests as well as storybook. These tests would ensure a given piece of schema will correctly render to the expected form element. 
