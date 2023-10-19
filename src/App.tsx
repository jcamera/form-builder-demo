
import { useEffect, useState } from 'react';
import './App.css';
import FormBuilder from './formBuilder2';

function App() {

  const [schema, setSchema] = useState({});

  useEffect(() => {
    const loadJson = async () => {
      const response = await fetch('/formSchema.json');
      const jsonResponse = await response.json();
      setSchema(jsonResponse.form);
    }
    loadJson();
  }, []);

  return (
    <>
      <h2>form builder demo</h2>
      <FormBuilder schema={schema}/>
    </>
  )
}

export default App;
