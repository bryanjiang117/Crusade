import React from "react";
import "./Sidebar.scss";
import { assets } from "../../assets/assets";
import { Context } from "../../contexts/Context";
import { Tooltip } from "react-tooltip";
const Sidebar = () => {
  const [extended, setExtended] = React.useState(true);
  const { startChat, openChat, chatSessions, curChatSessionID } =
    React.useContext(Context);

  let sidebarWidth;
  if (!extended) {
    sidebarWidth = "20%";
  } else {
    sidebarWidth = "70px";
  }
  return (
    <div className="sidebar" style={{ width: sidebarWidth }}>
      <div className="top">
        <img
          onClick={() => {
            setExtended(!extended);
          }}
          className="menu"
          src={assets.menu_icon}
          alt=""
          data-tooltip-id="menu"
          data-tooltip-content={extended ? "Expand" : "Collapse"}
        />
        <Tooltip
          id="menu"
          place={"bottom"}
          style={{ padding: "5px", fontSize: "12px", color: "#f0f4f9" }}
        />
        <div
          onClick={() => startChat()}
          className="new-chat"
          data-tooltip-id="new-chat"
          data-tooltip-content="New Chat"
          style={{ 
            maxWidth: !extended ? "200px" : "40px",
            transition: !extended ? "max-width 1s ease-in-out" : "max-width 0s"
          }}
        >
          <img src={assets.plus_icon} alt="" />
          <Tooltip
            id="new-chat"
            place={"bottom"}
            style={{ padding: "5px", fontSize: "12px", color: "#f0f4f9" }}
          />
          {!extended && <p className='chat-name'>New Chat</p>}
        </div>
        {!extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>
            
            {chatSessions.size > 0 ? 
            chatSessions.entries().map(([key, val], i) => {
              const firstPrompt = val.prevPrompts.length > 0 && val.prevPrompts[0] ? val.prevPrompts[0] : "New chat";
              return (
                <div 
                  key={i}
                  onClick={() => openChat(key)}
                  className={`recent-entry ${key === curChatSessionID ? 'active-chat' : ''}`}
                >
                  <img src={assets.message_icon} alt="" />
                  <p className='chat-name'>
                    {firstPrompt.slice(0, 24)} {firstPrompt.length > 24 && "..."}
                  </p>
                </div>
              )
            }) : null}
          </div>
        )}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {!extended && <p>Activity</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {!extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
