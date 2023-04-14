import "../normalize.css";
import { useNavigate } from "react-router-dom";
import routes from "../index";
import Cookies from "universal-cookie";


function Profile() {
    const navigate = useNavigate();
    const cookies = new Cookies();
    if (document.cookie.indexOf("token" + "=") != -1) {
        const token = new FormData();
        token.append("token", cookies.get('token') !== undefined ? cookies.get("token") : null)
        fetch(routes.fetchLaravel + "/index.php/isUserLogged", {
            method: "POST",
            mode: "cors",
            body: token,
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    console.log(data);
                } else {
                    navigate("/login");
                }
            });
    } else {
        navigate("/login");
    }
    fetch(routes.fetchLaravel + "/index.php/getUserData", {
        method: "GET",
        mode: "cors",
        credentials: "include",
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

        });
    return (
        <div>

            <button className="pixel-button" onClick={() => navigate("/")}>Main Menu</button>


        </div>
    );
}

export default Profile;