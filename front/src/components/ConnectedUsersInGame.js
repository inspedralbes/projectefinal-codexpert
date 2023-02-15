import "../normalize.css";
import { useState, useEffect } from "react";

function ConnectedUsersInGame({ socket }) {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        socket.on("lobby user list", (data) => {
            setUserList(data.list);
        });
    })

    return (
        <div className="lobby__connectedUsers">
            <h1 className="connectedUsers_title">Connected users</h1>
            <div id="userList" className="connectedUsers__userList userList">
                {userList.map((user, index) => {
                    return (
                        <div className="userList__item item" key={index}>
                            <img
                                src={user.avatar}
                                width="50px"
                                className="item__image"
                                alt={user.name + "'s avatar"}
                            ></img>
                            {user.name}
                            {user.hearts_remaining != -1 && <a>{user.hearts_remaining}</a>}
                        </div>
                    );
                })}
            </div>
        </div>

    );
}

export default ConnectedUsersInGame;
