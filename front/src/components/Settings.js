import { useState, useEffect } from "react";

function Settings({ fetchSettings }) {
    const [gameDuration, setGameDuration] = useState(301);
    const [heartAmount, setHeartAmount] = useState(0);
    const [questionAmount, setQuestionAmount] = useState(0);
    const [unlimitedHearts, setUnlimitedHearts] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function handleChangeUnlimitedHearts() {
        setUnlimitedHearts(!unlimitedHearts);
        window.network.setUnlimitedHearts(!unlimitedHearts);
    }

    function handleChangeGameDuration(e) {
        setGameDuration(e.target.value);
        window.network.setGameDuration(e.target.value);
    }

    function handleChangeHeartAmount(e) {
        setHeartAmount(e.target.value);
        window.network.setHeartAmount(e.target.value);
    }

    function handleChangeQuestionAmount(e) {
        setQuestionAmount(e.target.value);
        window.network.setQuestionAmount(e.target.value);
        console.log(window.network.getQuestionAmount());
    }

    const getSettings = () => {
        setHeartAmount(window.network.getHeartAmount());
        setGameDuration(window.network.getGameDuration());
        setUnlimitedHearts(window.network.getUnlimitedHearts());
        setQuestionAmount(window.network.getQuestionAmount());
    }

    const handleMessage = (event) => {
        let eventData = event.data

        switch (eventData.type) {

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

            case 'QUESTION_AMT_UNDER_MIN-event':
                setErrorMessage(window.network.getErrorMessage());
                break;

            case 'QUESTION_AMT_ABOVE_MAX-event':
                setErrorMessage(window.network.getErrorMessage());
                break;

            case 'INVALID_SETTINGS-event':
                setErrorMessage(window.network.getErrorMessage());
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
        if (fetchSettings) {
            getSettings();
        }
    }, [fetchSettings]);

    return (
        <>
            <div className="settings__zone">
                {errorMessage != "" && <h1 className="error">{errorMessage}</h1>}
                <form className="AddCategory" autoComplete="off">
                    <span className="addCategory__formSpanTA">
                        <p className="settings__zone__title">Game duration (seconds)</p>
                        <input type="number" value={gameDuration} onChange={handleChangeGameDuration} />
                    </span>

                    <span className="addCategory__formSpanTA">
                        <p className="settings__zone__title">Amount of questions:</p>
                        <input type="number" value={questionAmount} onChange={handleChangeQuestionAmount} />
                    </span>

                    <span className="addCategory__formSpanTA">
                        <p className="settings__zone__title">Amount of hearts per player:</p>
                        <input type="number" value={heartAmount} onChange={handleChangeHeartAmount} />
                    </span>

                    <div className="list__container__text settingCreator__checkbox">
                        <input
                            id='unl_hearts-check'
                            className="check"
                            type="checkbox"
                            value={unlimitedHearts}
                            onChange={handleChangeUnlimitedHearts}
                            checked={unlimitedHearts}
                        />
                        <label
                            htmlFor='unl_hearts-check'
                            className="list__container__text__label settingCreator__label"
                        >
                            <span
                                htmlFor='unl_hearts-check'
                                className="settings__zone__title"
                            >Unlimited hearts</span>
                        </label>
                    </div>
                </form>
            </div>
        </>

    );
}

export default Settings;
