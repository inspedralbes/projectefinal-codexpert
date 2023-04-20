import "../styles/normalize.css";
import "../styles/Loading.css";
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

function Loader() {
    return (
        <>
            <span className="loader"></span>
        </>
    );
}

export { Loading, Loader }