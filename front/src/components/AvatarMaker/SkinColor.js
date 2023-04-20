import "../../styles/normalize.css";
import { CirclePicker } from "react-color";

function SkinColor({ currentColor, handleChangeComplete, setChanges, ArrayColors, changes }) {

    return (
        <>
            <div className="avatar__colorPicker">
                <CirclePicker
                    color={currentColor}
                    onChangeComplete={handleChangeComplete}
                    onChange={(color) =>
                        setChanges({ ...changes, sC: color.hex.replace("#", "") })
                    }
                    colors={ArrayColors}
                />
            </div>
            <div className="avatar__options"><h1>This element has no type uwu</h1></div>
        </>
    );
}

export default SkinColor;
