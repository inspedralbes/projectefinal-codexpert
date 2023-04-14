import React, { useEffect, useState } from "react";
import "../normalize.css";
import "../game.css";
import "../Lobbies.css";
import { useNavigate, Link } from "react-router-dom";
import Chat from "../components/Chat";
import ConnectedUsersInGame from "../components/ConnectedUsersInGame";

function Game() {
  const [lobbyName, setLobbyName] = useState("");
  const [colorTema, setColorTema] = useState(false);
  const [code, setCode] = useState("");
  const [qst, setQst] = useState({
    statement: "",
    inputs: [""],
    output: "",
  });
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [winnerMessage, setWinnerMessage] = useState("");
  // const [finished, setFinished] = useState(false);
  const [playable, setPlayable] = useState(true);
  const [rewards, setRewards] = useState({
    xpEarned: 0,
    coinsEarned: 0,
    eloEarned: 0,
  });

  const navigate = useNavigate();

  const handleMessage = (event) => {
    let eventData = event.data

    switch (eventData.type) {
      case 'lobby_name-event':
        setLobbyName(window.network.getLobbyName())
        break;

      case 'question_data-event':
        setQst(window.network.getQuestionData());
        setCode("");
        break;

      case 'game_over-event':
        console.log(window.network.getWinnerMessage());
        setWinnerMessage(window.network.getWinnerMessage());
        setPlayable(false)
        break;

      case 'user_finished-event':
        setResult(window.network.getResult());
        setPlayable(false)
        break;

      case 'stats-event':
        setRewards(window.network.getRewards());
        break;

      case 'YOU_LEFT_LOBBY-event':
        navigate("/lobbies");
        break;

      default:
        console.log("Unknown event")
        break;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code != "") {
      let resultsEval = [];
      let evalPassed = true;
      qst.inputs.forEach((inp) => {
        let input = inp;
        try {
          let res = eval(code);
          resultsEval.push(res);
          // console.log(qst.inputs[1]);
          // let x = qst.testInput1;
          // console.log(code);
          // console.log(qst.input);
          console.log(resultsEval);
          setError("");
        } catch (e) {
          setError(e.message);
          evalPassed = false;
          // console.log(EvalError(code));
        }
      });

      console.log(resultsEval, evalPassed);

      window.postMessage({
        type: 'check_answer-emit',
        resultsEval: resultsEval,
        evalPassed: evalPassed,
      }, '*')
    }
  };

  function goBackToLobby() {
    navigate("/lobbies");
  }

  function leaveLobby() {
    window.postMessage({
      type: 'leave_lobby-emit',
      lobbyName: lobbyName
    }, '*')
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {

    if (colorTema) {
      document.getElementById('file-window').style.backgroundColor = '#333';
      document.getElementById('line-numbers').style.backgroundColor = '#222';
      document.getElementById('file-window').style.color = '#999';
      document.getElementById('textarea').style.color = '#999';
      document.getElementById('line-numbers').style.transition = 'all 0.3s';
      document.getElementById('file-window').style.transition = 'all 0.3s';

    } else {
      document.getElementById('file-window').style.backgroundColor = '#DDD';
      document.getElementById('line-numbers').style.backgroundColor = '#CCC';
      document.getElementById('file-window').style.color = '#666';
      document.getElementById('textarea').style.color = '#666';

    }
  }, [colorTema])

  return (
    <div>
      <div className="game__container ">

        <div className="container__left">
          <ConnectedUsersInGame></ConnectedUsersInGame>
          <Chat className="chat__chatbox" lobbyName={lobbyName}></Chat>
        </div>

        <div className="container__right">
          {playable && <div className="game__playing" >
            <div className="game__statement">
              <h2>Statement:</h2>
              <h1 className="game__statementTitle">{qst.statement}</h1>
            </div>
            <div className="game--grid">

              <div className="game__expectedInput">
                <h2>Example input:</h2>
                <h1>{qst.inputs[0].toString()}</h1>
              </div>

              <div className="game__expectedOutput">
                <h2>Example output:</h2>
                <h1>{qst.output.toString()}</h1>
              </div>
            </div>

            <form className="editor" onSubmit={handleSubmit}>

              <div className="input-header">
                <h1 className="editor__title">Input</h1>
                <div className="toggle">
                  <input onClick={() => setColorTema(!colorTema)} type="checkbox" />
                  <label></label>
                </div>
              </div>

              <div id="file-window" className="file-window js-view">

                <div id="line-numbers" className="line-numbers">
                  1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />
                  11<br />12<br />13<br />14<br />15<br />16<br />17<br />
                </div>

                {Array.isArray(qst.inputs[0]) && `let input = [${qst.inputs[0].toString()}];`}
                {!Array.isArray(qst.inputs[0]) && `let input = "${qst.inputs[0].toString()}";`}<br />
                {"function yourCode(input) {"}<br />

                <textarea
                  id="textarea"
                  className="input-strobe"
                  type="text"
                  value={code}
                  placeholder="Type in your code :)"
                  onChange={(e) => {
                    setCode(e.target.value);
                  }}
                ></textarea>
                <br />
                {"return input;"}<br />
                {"}"}<br />
                {"yourCode(input);"}

                <div className="help">
                  // This is your code input<br />
                  // You can, we trust you!! <br />
                </div>

              </div>

              <button className="game__submit" disabled={code == ""}>
                Submit
              </button>
            </form>

            {error != "" && <div>{error}</div>}

          </div>}
          {!playable && <div className="game__results">
            <h1 className="game__yourResult">{result}</h1>
            <h2>{winnerMessage}</h2>
            <ul className="game__rewards">
              <li>XP: {rewards.xpEarned}</li>
              <li>Coins: {rewards.coinsEarned}</li>
              <li>Elo: {rewards.eloEarned}</li>
            </ul>
            <p className="game__buttons">
              <button className="pixel-button game__button" onClick={goBackToLobby}>GO BACK TO LOBBY</button>

              <button className="pixel-button game__button" onClick={leaveLobby}>LOBBY LIST</button>
            </p>
          </div>}
        </div>
      </div>


    </div >

  );
}

export default Game;
