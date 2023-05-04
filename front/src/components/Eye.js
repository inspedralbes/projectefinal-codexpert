import '../styles/normalize.css'
import openEye from '../img/openEye.png'

function Eye({ id }) {
    const handleEye = () => {
        const pwd = document.getElementById(id)
        if (pwd.type === "password") {
            pwd.type = "text"
        } else {
            pwd.type = "password"
        }
    }

    return (
        <>
            <button onClick={() => handleEye()}><img src={openEye} alt=""></img></button>
        </>
    )
}

export default Eye
