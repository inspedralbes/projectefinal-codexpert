import "../normalize.css";
import "../IconUser.css";
import routes from "../index"
import Cookies from 'universal-cookie';
import { useState } from "react";

function IconUser() {
  const cookies = new Cookies();
  const [avatarURL, setAvatarURL] = useState(null)
  const token = new FormData()


  token.append("token", cookies.get('token'))
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
        <button type="button" class="button">
          <img src={avatarURL} height="50" width="50"></img>
        </button>
        <div class="dropdown">
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
            <li>Option 4</li>
          </ul>
        </div>

      </div>

    </div>
  );
}

export default IconUser;
