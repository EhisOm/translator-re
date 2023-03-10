import React, {useState, useEffect} from 'react';
import {
  Form,
  TextArea,
  Button,
  Icon
} from 'semantic-ui-react';
import axios from 'axios';

export default function Translate() {
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [selectedLanguageKey, setSelectedLanguageKey] = useState('');
  const [languageList, setLanguageList] = useState([]);
  const [detectLanguageKey, setDetectedLanguageKey] = useState('');
  const getLanguageSource = () => {
    axios.post('https://libretranslate.de/detect', {
      q: inputText
    })
    .then((response) => {
      setDetectedLanguageKey(response.data[0].language)
    })
  }
  const translateText = () => {
    setResultText(inputText)

    getLanguageSource();

    let data = {
      q : inputText,
      source: detectLanguageKey,
      target: selectedLanguageKey,
    }
    axios.post('https://libretranslate.de/translate', data)
    .then((response) => {
      setResultText(response.data.translatedText)
    })
  }

const languageKey = (selectedLanguage) => {
  setSelectedLanguageKey(selectedLanguage.target.value)
}

  useEffect(() => {
    axios.get('https://libretranslate.de/languages' )
    .then((response) => {
      setLanguageList(response.data)
    })

    // getLanguageSource ()
  }, [inputText])
  return (
    <div>
      <div className='app-header'>
        <h2 className='header'>Translator App</h2>
      </div>

      <div className='app-body'>
        <div>
          <Form>
            <Form.Field
              control={TextArea}
              placeholder='Enter text to translate...'
              onChange = {(e) => setInputText(e.target.value)}
            />
              <select className= 'language-select' onChange={languageKey} >
                <option>Select Language</option>
                {languageList.map((language) =>  {
                  return (
                    <option value={language.code}>
                      {language.name}
                    </option>
                )
              })}
            </select>
              

            <Form.Field
              control={TextArea}
              placeholder='Translation Results...'
              value= {resultText}
            />

            <Button color='green' 
              size='large' 
              onClick={translateText}
              >
              <Icon name='translate' 
              /> 
              Translate </Button>
          </Form>
        </div>
      </div>
    </div>
  )
}