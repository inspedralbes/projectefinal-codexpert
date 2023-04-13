import "../normalize.css";
import { useState, useEffect } from "react";

function ConnectedUsers({ socket }, u) {
    const [userList, setUserList] = useState([]);
    const [firstTime, setFirstTime] = useState(true);

    const handleMessage = (event) => {
        switch (event.data.type) {

            case 'lobby_user_list-event':
                setUserList(event.data.userList);
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        if (firstTime) {
            socket.emit("lobby_data_pls");
            setFirstTime(false);
        }
        socket.on("lobby_user_list", (data) => {
            setUserList(data.list);
        });

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [])

    // useEffect(() => {
    //     userList.forEach(user => {
    //         const url = new URL(user.avatar);
    //         user.bg = url.searchParams.get("backgroundColor")
    //         console.log(user.bg);
    //     });
    // }, [userList])


    return (
        <div className="game__connectedUsers">
            <h1 className="connectedUsers_title">Connected users</h1>
            <ul id="userList" className="connectedUsers__userList userList">
                {userList.map((user, index) => {
                    return (
                        <li id="bgColor" className="userList__item item" key={index}>
                            <div className="item__imgDiv">
                                <img
                                    src={user.avatar}
                                    width="150px"
                                    className="item__image"
                                    alt={user.name + "'s avatar"}
                                ></img>
                            </div>

                            <div className="item__name">
                                <p>{user.name}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>

    );
}

export default ConnectedUsers;
