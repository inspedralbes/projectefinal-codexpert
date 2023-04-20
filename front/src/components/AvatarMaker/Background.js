import "../../styles/normalize.css";
import { CirclePicker } from "react-color";

function Background({ currentColor, handleChangeComplete, setChanges, ArrayColors, changes }) {

    return (
        <>
            <div className="avatar__colorPicker">

                <CirclePicker
                    color={currentColor}
                    onChangeComplete={handleChangeComplete}
                    onChange={(color) =>
                        setChanges({ ...changes, bg: color.hex.replace("#", "") })
                    }
                    colors={ArrayColors}
                />
            </div>
            <div className="avatar__options"><h1>This element has no type.</h1></div>
        </>
    );
}

export default Background;
