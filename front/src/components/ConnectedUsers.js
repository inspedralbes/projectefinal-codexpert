import "../normalize.css";
import { useState, useEffect } from "react";

function ConnectedUsers({ socket }) {
    const [userList, setUserList] = useState([]);
    const [firstTime, setFirstTime] = useState(true);

    useEffect(() => {
        if (firstTime) {
            socket.emit("lobby_data_pls");
        }
        socket.on("lobby user list", (data) => {
            setUserList(data.list);
        });
    }, [])

    return (
        <div className="game__connectedUsers">
            <h1 className="connectedUsers_title">Connected users</h1>
            <ul id="userList" className="connectedUsers__userList userList">
                {userList.map((user, index) => {
                    return (
                        <li className="userList__item item" key={index}>
                            <img
                                src={user.avatar}
                                width="50px"
                                className="item__image"
                                alt={user.name + "'s avatar"}
                            ></img>
                            {user.name}
                        </li>
                    );
                })}
            </ul>
        </div>

    );
}

export default ConnectedUsers;
