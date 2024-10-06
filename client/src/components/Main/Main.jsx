import React from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../contexts/Context";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const Main = () => {
  const {
    getPrevPrompts,
    getPrevResults,
    onSent,
    recentPrompt,
    generating,
    loading,
    resultData,
    setInput,
    input,
    startChat,
    startOfChat,
    curChatSessionID,
    Markdown,
  } = React.useContext(Context);
  const [chatHistory, setChatHistory] = React.useState([]);

  const cardPrompts = [
    "What are some long TV series similar to Game of Thrones?",
    "Recommend me a light-hearted sitcom with no plot at all",
    "Anime like Anohana and Violet Evergarden to make me cry",
    "Need a comedy with plenty of sex jokes for movie night with the boys"
  ];


  // Managing the scrolling behaviour for the chat

  const scrollContainer = React.useRef(null);
  const scrollTimeout = React.useRef(null); 
  const [userIsScrolling, setUserIsScrolling] = React.useState(false);

  React.useEffect(() => {
    scrollContainer.current = document.querySelector('.result-container');

    if (scrollContainer.current) {

      function handleScroll() {
        // console.log('user is scrolling');
        setUserIsScrolling(true);

        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
          setUserIsScrolling(false);
        }, 100);
      }

      scrollContainer.current.addEventListener('wheel', handleScroll);

      return () => {
        scrollContainer.current.removeEventListener('wheel', handleScroll);
        clearTimeout(scrollTimeout.current);
      }
    }
  }, [startOfChat]);

  function scrollToBottom() {
    setTimeout(() => {
      scrollContainer.current.scroll({top: scrollContainer.current.scrollHeight, behavior: 'smooth'});
    }, 100);
  }

  React.useEffect(() => {

    function shouldScroll() {
      const atBottom = scrollContainer.current.scrollTop >= scrollContainer.current.scrollHeight - scrollContainer.current.clientHeight
      return !userIsScrolling;
    }

    if (!startOfChat && scrollContainer.current) {
      if (shouldScroll()) {
        scrollToBottom()
      }
    }
  }, [resultData])

  // Update chat history when generating (using chatHistory state because it's different depending on whether it's generating or not and causes issues if not separated)
  React.useEffect(() => {
    if (!startOfChat) {
      if (generating) {
        setChatHistory([...getPrevPrompts().slice(0, -1).map((prompt, i) => ({
          prompt: prompt, 
          result: getPrevResults()[i],
        })),
        ({
          prompt: recentPrompt,
          result: resultData,
        })]);
      } else {
        console.log('not generating', getPrevPrompts().slice(0, -1))
        setChatHistory(getPrevPrompts().map((prompt, i) => {
          return {
            prompt: prompt,
            result: getPrevResults()[i],
          }
        }));
      }
    }
  }, [curChatSessionID, startOfChat, recentPrompt, resultData]);

  function send(prompt) {
    onSent(prompt)
    scrollToBottom()
  }

  // Start the chat

  React.useEffect(() => {
    startChat();
  }, []);


  return (
    <div className="main">
      <div className="nav">
        <p>Crusader</p>
      </div>
      <div className="main-container">
        {startOfChat ? (
            <>
              <div className="greet">
                <p>
                  <span>Crusader</span>
                </p>
                <p>Where would you like to go?</p>
              </div>
              <div className="cards">
                {cardPrompts.map((prompt, i) => {
                  return (
                    <div className="card" key={i} onClick={() => onSent(prompt)}>
                      <p>{prompt}</p>
                    </div>
                  );
                })}
              </div>
            </>
        ) : (
          <div className="result-container">
            {chatHistory.map(({prompt: prompt, result: result}, i) => {
              return (
                  <div className="result" key={i}>
                    <div className="result-title">
                      <p>{prompt}</p>
                    </div>
                    <div className="result-data">
                      <img
                        src={assets.icon}
                        alt=""
                      />
                      {loading && i === getPrevPrompts().length - 1 ? (
                        <div className="loader">
                          <hr />
                          <hr />
                          <hr />
                        </div>
                      ) : (
                        <p
                          style={{ marginTop: "0px" }}
                          dangerouslySetInnerHTML={{ __html: Markdown(result) }}
                        ></p>
                      )}
                  </div>
                </div>
              )})}
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onKeyDown={(e) => {
                if (input && e.key === "Enter") {
                  onSent();
                }
              }}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              {input.length > 0 && (
                <span className={`send-icon ${input.length > 0 ? "show" : ""}`}>
                  <img
                    onClick={() => {
                      onSent();
                    }}
                    src={assets.send_icon}
                    alt=""
                    data-tooltip-id="submit"
                    data-tooltip-content="Submit"
                  />
                  <Tooltip
                    id="submit"
                    style={{
                      padding: "5px",
                      fontSize: "12px",
                      color: "#f0f4f9",
                    }}
                  />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
