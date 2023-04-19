import "../../styles/normalize.css";
import { CirclePicker } from "react-color";

function Accessories({ currentColor, handleChangeComplete, setChanges, ArrayColors, changes }) {

    return (
        <>
            <div className="avatar__colorPicker">
                <CirclePicker
                    color={currentColor}
                    onChangeComplete={handleChangeComplete}
                    onChange={(color) =>
                        setChanges({ ...changes, aC: color.hex.replace("#", "") })
                    }
                    colors={ArrayColors}
                />
            </div>
            <div className="avatar__options">

                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, aP: "0" })}>
                    <img src={require('../../img/x.png')} alt="No Accessories" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, a: "variant01", aP: "100" })} >
                    <img src={require('../../img/avatar/accessories/variant01.png')} alt="Accessories" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, a: "variant02", aP: "100" })}>
                    <img src={require('../../img/avatar/accessories/variant02.png')} alt="Accessories" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, a: "variant03", aP: "100" })}>
                    <img src={require('../../img/avatar/accessories/variant03.png')} alt="Accessories" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, a: "variant04", aP: "100" })}>
                    <img src={require('../../img/avatar/accessories/variant04.png')} alt="Accessories" width='100px' height='100px'></img>
                </button>
            </div>
        </>
    );
}

export default Accessories;
