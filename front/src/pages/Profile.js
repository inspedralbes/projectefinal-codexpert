import "../styles/normalize.css";
import { useNavigate } from "react-router-dom";
import routes from "../index";
import { useState, useEffect } from "react";
import Modal from 'react-modal';
Modal.setAppElement('body');


function Profile() {
    const navigate = useNavigate();
    let [userData, setUserData] = useState({});
    let [editUser, setEditUser] = useState({});
    let [modals, setModals] = useState({
        name: false,
        email: false,
        password: false
    });

    const getUserData = () => {
        fetch(routes.fetchLaravel + "getUserData", {
            method: "GET",
            mode: "cors",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    navigate("/login")
                } else {
                    setUserData(data);
                }
            });
    }

    // currentPassword, newPassword, newPassword_confirmation

    useEffect(() => {
        getUserData();
        setEditUser(userData);
    }, [])

    const saveChanges = (type) => {
        const user = new FormData();
        if (type === "newName") {
            user.append(type, editUser.name);
        } else {
            user.append(type, editUser.email);
        }

        user.append("password", editUser.password);
        fetch(routes.fetchLaravel + (type === "newName" ? "changeUsername" : "changeEmail"), {
            method: "POST",
            mode: "cors",
            body: user,
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
        setModals(prev => ({ ...prev, name: false }));
        setUserData(prev => ({ ...prev, name: editUser.name, email: editUser.email }));
    }

    return (
        <div>
            <button className="pixel-button" onClick={() => navigate("/")}>Main Menu</button>
            <table>
                <tbody>
                    <tr>
                        <td><p>{userData.name}</p></td>
                        <td><button onClick={() => setModals(prev => ({ ...prev, name: true }))}>Edit</button></td>
                        <Modal
                            style={{ //QUITAR Y PERSONALIZAR ESTILOS CUANDO SE APLIQUE CSS
                                content: {
                                    top: '50%',
                                    left: '50%',
                                    right: 'auto',
                                    bottom: 'auto',
                                    marginRight: '-50%',
                                    transform: 'translate(-50%, -50%)',
                                },
                            }}
                            onRequestClose={() => setModals(prev => ({ ...prev, name: false }))}
                            shouldCloseOnOverlayClick={true}
                            isOpen={modals.name}
                        >

                            <input placeholder="username" name="name" onChange={(e) => setEditUser(prev => ({ ...prev, name: e.target.value }))}></input><br></br>
                            <input placeholder="password" name="password" onChange={(e) => setEditUser(prev => ({ ...prev, password: e.target.value }))}></input><br></br>
                            <button onClick={() => setModals(prev => ({ ...prev, name: false }))}>Close</button>
                            <button onClick={() => saveChanges("newName")}>Save</button>

                        </Modal>
                    </tr>
                    <tr>
                        <td><p>{userData.email}</p></td>
                        <td><button onClick={() => setModals(prev => ({ ...prev, email: true }))}>Edit</button></td>
                        <Modal
                            style={{ //QUITAR Y PERSONALIZAR ESTILOS CUANDO SE APLIQUE CSS
                                content: {
                                    top: '50%',
                                    left: '50%',
                                    right: 'auto',
                                    bottom: 'auto',
                                    marginRight: '-50%',
                                    transform: 'translate(-50%, -50%)',
                                },
                            }}
                            onRequestClose={() => setModals(prev => ({ ...prev, email: false }))}
                            shouldCloseOnOverlayClick={true}
                            isOpen={modals.email}
                        >

                            <input placeholder="email" name="name" onChange={(e) => setEditUser(prev => ({ ...prev, email: e.target.value }))}></input><br></br>
                            <input placeholder="password" name="password" onChange={(e) => setEditUser(prev => ({ ...prev, password: e.target.value }))}></input><br></br>
                            <button onClick={() => setModals(prev => ({ ...prev, email: false }))}>Close</button>
                            <button onClick={() => saveChanges("newEmail")}>Save</button>

                        </Modal>
                    </tr>
                    <tr>
                        <td><button onClick={() => setModals(prev => ({ ...prev, name: true }))}>Change password</button></td>
                    </tr>

                </tbody>
            </table>


            <img src={userData.avatar}></img>
            <button className="pixel-button" onClick={() => navigate("/avatarMaker")}>Edit avatar</button>
        </div>
    );
}

export default Profile;