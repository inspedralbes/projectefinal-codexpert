import "../styles/normalize.css";
import { Blocks } from 'react-loader-spinner'

function Loading() {

    return (
        <>
            <h1>Loading</h1>
            <Blocks
                visible={true}
                height="80"
                width="80"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
            />
        </>

    );
}

export default Loading;
