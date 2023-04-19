import "../../styles/normalize.css";
import { CirclePicker } from "react-color";

function Eyes({ currentColor, handleChangeComplete, setChanges, ArrayColors, changes }) {

    return (
        <>
            <div className="avatar__colorPicker">

                <CirclePicker
                    color={currentColor}
                    onChangeComplete={handleChangeComplete}
                    onChange={(color) =>
                        setChanges({ ...changes, eC: color.hex.replace("#", "") })
                    }
                    colors={ArrayColors}
                />
            </div>
            <div className="avatar__options">
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant01" })}>
                    <img src={require('../../img/avatar/eyes/variant01.png')} alt="Eyes" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant02" })}>
                    <img src={require('../../img/avatar/eyes/variant02.png')} alt="Eyes" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant03" })}>
                    <img src={require('../../img/avatar/eyes/variant03.png')} alt="Eyes" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant04" })}>
                    <img src={require('../../img/avatar/eyes/variant04.png')} alt="Eyes" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant05" })}>
                    <img src={require('../../img/avatar/eyes/variant05.png')} alt="Eyes" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant06" })}>
                    <img src={require('../../img/avatar/eyes/variant06.png')} alt="Eyes" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant07" })}>
                    <img src={require('../../img/avatar/eyes/variant07.png')} alt="Eyes" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant08" })}>
                    <img src={require('../../img/avatar/eyes/variant08.png')} alt="Eyes" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant09" })}>
                    <img src={require('../../img/avatar/eyes/variant09.png')} alt="Eyes" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant10" })}>
                    <img src={require('../../img/avatar/eyes/variant10.png')} alt="Eyes" width='100px' height='100px'></img>

                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant11" })}>
                    <img src={require('../../img/avatar/eyes/variant11.png')} alt="Eyes" width='100px' height='100px'></img>

                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant12" })}>
                    <img src={require('../../img/avatar/eyes/variant12.png')} alt="Eyes" width='100px' height='100px'></img>
                </button>
            </div>
        </>
    );
}

export default Eyes;
