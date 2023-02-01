import "../normalize.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import routeFetch from "../index"
import session from "./UserSession";


function Logout() {
    const [logout, setLogout] = useState(0);

    useEffect(() => {
        if (logout != 0) {

            fetch(routeFetch + "/api/logout", {
                method: 'POST',
            })
                .then((response) => response.json())
                .then(() => {
                    console.log(session.getData());
                    session.setData({});
                    console.log(session.getData());
                }
                );
        }

    }, [logout]);
    return (
        <div>
            <button onClick={() => setLogout(logout + 1)}>Logout</button>
        </div>
    );
}

export default Logout;
