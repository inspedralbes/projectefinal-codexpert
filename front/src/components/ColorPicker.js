import React from 'react';
import { SketchPicker } from 'react-color';

class Component extends React.Component {
    state = {
        background: '#fff',
    };

    color = '#000';

    handleChangeComplete = (color) => {
        this.setState({ background: color.hex });
        console.log(color.hex);
        color = color.hex;
        console.log('color: '+color);

    };


    render() {
        return (
            <SketchPicker
                color={this.state.background}
                onChangeComplete={this.handleChangeComplete}
            />

        );
    }
}

export default Component;


