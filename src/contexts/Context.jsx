import React from "react";
import { marked } from "marked";

export const Context = React.createContext();

const ContextProvider = (props) => {
  const [input, setInput] = React.useState("");
  const [recentPrompt, setRecentPrompt] = React.useState("");
  const [prevPrompts, setPrevPrompts] = React.useState([]);
  const [prevResults, setPrevResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [resultData, setResultData] = React.useState("");
  const [startOfChat, setStartOfChat] = React.useState(false);
  const [chatSession, setChatSession] = React.useState(null);

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 10 * index);
  };

  function Markdown(markdownData) {
    return marked.parse(markdownData);
  }

  async function generate(prompt) {
    console.log(prevPrompts, prevResults);
    if (prevPrompts.length !== prevResults.length) {
      console.error("Prev prompt and results arrays are of different lengths");
      return;
    }
    let history = []
    for (let i = 0; i < prevPrompts.length; i++) {
      history.push({role: 'user', parts: [prevPrompts[i]]});
      history.push({role: 'model', parts: [prevResults[i]]});
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        session_id: chatSession,
      })
    });
    
    const data = await res.json();
    const response = data.response;
    // console.log('response', response);
    return response;
  }

  async function newChat() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/new_chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    const data = await res.json();
    const response = data.session_id;
    // console.log('new chat', response);
    return response;
  }

  async function startChat() {
    setStartOfChat(true);
    setChatSession(await newChat());
  };

  const onSent = async (prompt) => {
    setInput("");
    setResultData("");
    setLoading(true);
    setStartOfChat(false)

    // Placeholder for loading animation
    setPrevPrompts((prev) => [...prev, ""]);
    setPrevResults((prev) => [...prev, ""]);

    let response;
    if (prompt !== undefined) {
      // when prompt is passed, it means the user has clicked on a suggestion
      response = await generate(prompt);
      setRecentPrompt(prompt);
    } else {
      // when prompt isn't passed, it means user has entered a prompt in input field
      setRecentPrompt(input);
      response = await generate(input);
    } 
    setPrevPrompts((prev) => [...prev.slice(0, -1), prompt || input]);
    setPrevResults((prev) => [...prev.slice(0, -1), response]);
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
    prevResults,
    setPrevResults,
    onSent,
    setRecentPrompt,
    recentPrompt,
    loading,
    resultData,
    input,
    setInput,
    startChat,
    startOfChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
