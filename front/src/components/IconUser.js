import "../normalize.css";
import "../IconUser.css";
import routes from "../index";
import Cookies from "universal-cookie";
import { useState } from "react";

function IconUser() {
  const cookies = new Cookies();
  const token = new FormData();
  const [state, setState] = useState(false);
  const [avatarURL, setAvatarURL] = useState(null);

  const handleButtonClick = () => {
    setState(!state)
  };

  const handleClickOutside = () => {
    setState(!state)
  };

  componentDidMount() {
    document.addEventListener("mousedown", handleClickOutside());
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", handleClickOutside());
  }

  token.append("token", cookies.get("token"));
  fetch(routes.fetchLaravel + "/index.php/getAvatar", {
    method: "POST",
    mode: "cors",
    body: token,
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      setAvatarURL(data.url);
    });
  return (
    <div className="App">
      <div className="container">
        <button
          type="button"
          className="button"
          onClick={handleButtonClick}
        >
          <img src={avatarURL} height="50" width="50"></img>
        </button>
        {state && (
          <div className="dropdown">
            <ul>
              <li>Profile</li>
              <li>Avatar Maker</li>
              <li>Log Out</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default IconUser;
