import "../normalize.css";
import { useNavigate } from "react-router-dom";
import routes from "../index";
import { useState, useEffect } from "react";
import Modal from 'react-modal';


function Profile() {
    const navigate = useNavigate();
    let [userData, setUserData] = useState({});
    let [modals, setModals] = useState({
        name: false,
        email: false,
        password: false
    })

    const getUserData = () => {
        fetch(routes.fetchLaravel + "/index.php/getUserData", {
            method: "GET",
            mode: "cors",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    navigate("/login")
                } else {
                    console.log(data);
                    setUserData(data);
                }

            });
    }

    useEffect(() => {
        getUserData();
    }, [])

    const saveChanges = () => {

        fetch(routes.fetchLaravel + "/index.php/changeUsername", {
            method: "POST",
            mode: "cors",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    navigate("/login")
                } else {
                    console.log(data);
                    setUserData(data);
                }

            });
        setModals(prev => ({ ...prev, name: false }))
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

                            <input placeholder="username" name="name"></input><br></br>
                            <input placeholder="password" name="password"></input><br></br>
                            <button onClick={() => setModals(prev => ({ ...prev, name: false }))}>Close</button>
                            <button onClick={saveChanges}>Save</button>

                        </Modal>
                    </tr>
                    <tr>
                        <td><p>{userData.email}</p></td>
                        <td><button>Edit</button></td>
                    </tr>

                </tbody>
            </table>
            <img src={userData.avatar}></img>
            <button className="pixel-button" onClick={() => navigate("/avatarMaker")}>Edit avatar</button>
        </div>
    );
}

export default Profile;