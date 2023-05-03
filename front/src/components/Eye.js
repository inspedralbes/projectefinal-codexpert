import '../styles/normalize.css'

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
            <button onClick={() => handleEye()}>Eie</button>
        </>
    )
}

export default Eye
