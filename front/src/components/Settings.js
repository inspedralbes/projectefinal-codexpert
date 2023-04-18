import { useState, useEffect } from "react";

function Settings({ start }) {
    const [gameDuration, setGameDuration] = useState(0);
    const [heartAmount, setHeartAmount] = useState(0);
    const [unlimitedHearts, setUnlimitedHearts] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSettings, setShowSettings] = useState(false);

    function handleChangeUnlimitedHearts() {
        setUnlimitedHearts(!unlimitedHearts);
    }

    function handleChangeGameDuration(e) {
        setGameDuration(e.target.value);
    }

    function handleChangeHeartAmount(e) {
        setHeartAmount(e.target.value);
    }

    const handleMessage = (event) => {
        let eventData = event.data

        switch (eventData.type) {
            case 'lobby_settings-event':
                setHeartAmount(window.network.getHeartAmount());
                setGameDuration(window.network.getGameDuration());
                setUnlimitedHearts(window.network.getUnlimitedHearts());
                break;

            case 'GAME_TIME_UNDER_MIN-event':
                setErrorMessage(window.network.getErrorMessage());
                break;

            case 'GAME_TIME_ABOVE_MAX-event':
                setErrorMessage(window.network.getErrorMessage());
                break;

            case 'HEARTS_AMT_UNDER_MIN-event':
                setErrorMessage(window.network.getErrorMessage());
                break;

            case 'HEARTS_AMT_ABOVE_MAX-event':
                setErrorMessage(window.network.getErrorMessage());
                break;

            case 'INVALID_SETTINGS-event':
                setErrorMessage(window.network.getErrorMessage());
                break;

            case 'show_settings-event':
                setShowSettings(window.network.getShowSettings())
                break;

            default:
                // UNKNOWN EVENT TO THAT COMPONENT
                break;
        }
    }

    useEffect(() => {
        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    useEffect(() => {
        if (start) {
            setErrorMessage("");

            window.postMessage({
                type: 'save_settings-emit',
                gameDuration: gameDuration,
                heartAmount: heartAmount,
                unlimitedHearts: unlimitedHearts
            }, '*')
        }
    }, [start]);

    return (
        <>
            {showSettings ?
                <div className="settings__zone">
                    {/* <h2>SETTINGS </h2> */}
                    {errorMessage != "" && <h1 className="error">{errorMessage}</h1>}
                    <form className="App" autoComplete="off">
                        <span className="addCategory__formSpanTA">
                            <p className="settings__zone__title">Game duration (seconds)</p>
                            <input type="number" value={gameDuration} onChange={handleChangeGameDuration} />
                        </span>
                        <span className="addCategory__formSpanTA">
                            <p className="settings__zone__title">Amount of hearts per player:</p>
                            <input type="number" value={heartAmount} onChange={handleChangeHeartAmount} />
                        </span>

                        <div className="list__container__text settingCreator__checkbox">
                            <input
                                id='hola'
                                className="check"
                                type="checkbox"
                                value={unlimitedHearts}
                                onChange={handleChangeUnlimitedHearts}
                            />
                            <label
                                htmlFor='hola'
                                className="list__container__text__label settingCreator__label"
                            >
                                <span
                                    htmlFor='hola'
                                    className="settings__zone__title"
                                >Unlimited hearts</span>
                            </label>
                        </div>
                    </form>
                </div> :
                <></>}
        </>

    );
}

export default Settings;
