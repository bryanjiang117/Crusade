import React from "react";
import { marked } from "marked";

export const Context = React.createContext();

const ContextProvider = (props) => {
  const [input, setInput] = React.useState("");
  const [recentPrompt, setRecentPrompt] = React.useState("");
  const [prevPrompts, setPrevPrompts] = React.useState([]);
  const [showResult, setShowResult] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [resultData, setResultData] = React.useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 40 * index);
  };

  function Markdown(markdownData) {
    return marked.parse(markdownData);
  }

  async function generate(prompt) {
    const history = prevPrompts.reduce((acc, cur) => {
      acc.push({role: 'user', parts: [cur.prompt]});
      acc.push({role: 'model', parts: [cur.response]});
      return acc
    }, []);
    
    console.log('my history', history);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        history: history,
      })
    });
    
    const data = await res.json();
    const response = data.response;
    console.log('response', response);
    return response;
  }

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };
  const onSent = async (prompt) => {
    setInput("");
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await generate(prompt);
      setRecentPrompt(prompt);
    } else {
      setRecentPrompt(input);
      response = await generate(input);
      
      setPrevPrompts((prev) => [...prev, {'prompt': input, 'response': response}]);
      console.log(prevPrompts);
    }
    let newResponseArray = Markdown(response).split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
