import "../normalize.css";
import "../IconUser.css";
import routes from "../index";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function IconUser() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [state, setState] = useState(false);
  const [avatarURL, setAvatarURL] = useState(null);
  const [logOut, setLogOut] = useState(false);

  const handleButtonClick = () => {
    setState(!state)
  };

  const handleClickOutside = () => {
    setState(!state)
  };

  useEffect(() => {
    const token = new FormData();
    token.append("token", cookies.get("token"));
    console.log();
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
  }, []);

  useEffect(() => {
    if (logOut) {
      fetch(routes.fetchLaravel + "/index.php/logout", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const nCookies = document.cookie.split(";");
          console.log(nCookies);

          for (let i = 0; i < nCookies.length; i++) {
            const cookie = nCookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
          navigate("/login");
        });
    }
  }, [logOut]);

  return (
    <div className="App">
      <div className="container">
        <button
          type="button"
          className="button"
          onClick={handleButtonClick}
        >
          <img className="button__image" src={avatarURL} height="50" width="50"></img>
        </button>
        {state && (
          <div className="dropdown">
            <ul className="dropdown__list list">
              <li className="list__item">Profile</li>
              <li className="list__item"><button className="button" onClick={() => navigate("/avatarMaker")}>Avatar Maker</button></li>
              <li className="list__item"> <button className="button" onClick={() => setLogOut(!logOut)}>Log Out</button></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default IconUser;
