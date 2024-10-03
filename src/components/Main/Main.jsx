import React from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../contexts/Context";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loadingState,
    loading,
    resultData,
    setInput,
    input,
    newChat,
  } = React.useContext(Context);

  const cardPrompts = [
    "What are some long TV series similar to Game of Thrones?",
    "Recommend me a light-hearted sitcom with no plot at all",
    "Anime like Anohana and Violet Evergarden to make me cry",
    "Need a comedy with plenty of sex jokes for movie night with the boys"
  ];

  return (
    <div className="main">
      <div className="nav">
        <p>Crusader</p>
      </div>
      <div className="main-container">
        {!showResult ? (
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
                    <div className="card" key={i} onClick={() => newChat(prompt)}>
                      <p>{prompt}</p>
                    </div>
                  );
                })}
              </div>
            </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img
                src={assets.gemini_icon}
                alt=""
              />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p
                  style={{ marginTop: "0px" }}
                  dangerouslySetInnerHTML={{ __html: resultData }}
                ></p>
              )}
            </div>
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
