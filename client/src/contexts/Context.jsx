import React from "react";
import { marked } from "marked";

export const Context = React.createContext();

const ContextProvider = (props) => {
  const [input, setInput] = React.useState("");
  const [recentPrompt, setRecentPrompt] = React.useState("");
  const [generating, setGenerating] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [resultData, setResultData] = React.useState("");
  const [startOfChat, setStartOfChat] = React.useState(true);
  const [curChatSessionID, setCurChatSessionID] = React.useState(null);
  const [chatSessions, setChatSessions] = React.useState(new Map());

  function getPrevPrompts() {
    if (chatSessions.size > 0) {
      return chatSessions.get(curChatSessionID).prevPrompts;
    }
    return [];
  }

  function getPrevResults() {
    if (chatSessions.size > 0) {
      return chatSessions.get(curChatSessionID).prevResults;
    }
    return [];
  }

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 10 * index);
  };

  function Markdown(markdownData) {
    return marked.parse(markdownData);
  }

  async function generate(prompt) {
    const prevPrompts = getPrevPrompts();
    const prevResults = getPrevResults();
    if (prevPrompts.length !== prevResults.length) {
      console.error("Prev prompt and results arrays are of different lengths");
      return;
    }
    let history = []
    for (let i = 0; i < prevPrompts.length; i++) {
      history.push({role: 'user', parts: [prevPrompts[i]]});
      history.push({role: 'model', parts: [prevResults[i]]});
    }

    const res = await fetch('/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        session_id: curChatSessionID,
      })
    });
    
    const data = await res.json();
    const response = data.response;
    // console.log('response', response);
    return response;
  }

  // change
  async function newChat() {
    if (generating) return;
    const res = await fetch('/new_chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    const data = await res.json();
    const response = data.session_id;
    setCurChatSessionID(response)

    return response;
  }

  async function startChat() {
    if (generating) return;
    setInput("");
    setResultData("");
    setStartOfChat(true);
    const chatSessionID = await newChat()
    // Add new chat session to chatSessions
    const updatedChatSessions = chatSessions
    updatedChatSessions.set(chatSessionID, {
      prevPrompts: [],
      prevResults: [],
    });
    setChatSessions(updatedChatSessions);
    openChat(chatSessionID);
  };

  async function openChat(chatSessionID) {
    if (generating) return;
    setInput("")
    setRecentPrompt("")
    setResultData("")
    setCurChatSessionID(chatSessionID);
    setStartOfChat(chatSessions.get(chatSessionID).prevPrompts.length === 0);
    // console.log('new opened chat', chatSessions.get(chatSessionID) ? chatSessions.get(chatSessionID).prevPrompts[0] : null);
  }

  const onSent = async (prompt) => {
    if (generating) return;
    setInput("");
    setResultData("");
    setGenerating(true);
    setLoading(true);
    setStartOfChat(false)

    const curChatSession = chatSessions.get(curChatSessionID);
    // Placeholder for loading animation
    curChatSession.prevPrompts.push(null);
    curChatSession.prevResults.push(null);

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
    // Replace placeholder with value
    curChatSession.prevPrompts[curChatSession.prevPrompts.length - 1] = prompt || input;
    curChatSession.prevResults[curChatSession.prevResults.length - 1] = response
    let newResponseArray = response.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setTimeout(() => setGenerating(false), 10 * newResponseArray.length + 100);
  };

  const contextValue = {
    getPrevPrompts,
    getPrevResults,
    onSent,
    setRecentPrompt,
    recentPrompt,
    generating,
    loading,
    resultData,
    input,
    setInput,
    startChat,
    openChat,
    startOfChat,
    chatSessions,
    curChatSessionID,
    Markdown,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
