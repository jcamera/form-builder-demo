
import { useEffect, useState } from 'react';
import './App.css';
import FormBuilder from './FormBuilder';
import { Schema } from './types';

function App() {

  const [schema, setSchema] = useState<Schema>({});

  useEffect(() => {
    const loadJson = async () => {
      const response = await fetch('/formSchema.json');
      const jsonResponse = await response.json();
      setSchema(jsonResponse.form);
    }
    loadJson();
  }, []);

  return <FormBuilder schema={schema}/>;
}

export default App;
