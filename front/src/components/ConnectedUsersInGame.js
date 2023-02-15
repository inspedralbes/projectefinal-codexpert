import "../normalize.css";
import { useState, useEffect } from "react";

function ConnectedUsersInGame({ socket }) {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        socket.on("lobby user list", (data) => {
            setUserList(data.list);
            console.log(userList);
        });
    })

    return (
        <div className="lobby__connectedUsers">
            <h1 className="connectedUsers_title">Connected users</h1>
            <div id="userList" className="connectedUsers__userList userList">
                {userList.map((user, index) => {
                    return (
                        <div className="userList__item item" key={index}>
                            <div>{user.name}</div>
                            <div> {user.hearts_remaining > 0 &&
                                <img
                                    src={user.avatar}
                                    width="50px"
                                    className="item__image"
                                    alt={user.name + "'s avatar"}
                                ></img>}

                                {user.hearts_remaining == 0 &&
                                    <img src={require('../img/hearts/skull.gif')}
                                        width="50px"
                                        className="item__image"
                                        alt={"user lost"} />}
                            </div>

                            <div>
                                {user.hearts_remaining == 3 &&
                                    <img src={require('../img/hearts/three_hearts.png')}
                                        height="50px"
                                        className="item__image"
                                        alt={user.hearts_remaining + " hearts remaining"} />}

                                {user.hearts_remaining == 2 &&
                                    <img src={require('../img/hearts/two_hearts.gif')}
                                        height="50px"
                                        className="item__image"
                                        alt={user.hearts_remaining + " hearts remaining"} />}

                                {user.hearts_remaining == 1 &&
                                    <img src={require('../img/hearts/one_heart.gif')}
                                        height="50px"
                                        className="item__image"
                                        alt={user.hearts_remaining + " hearts remaining"} />}
                            </div>

                            <div>
                                Level: {user.question_at + 1}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>

    );
}

export default ConnectedUsersInGame;
