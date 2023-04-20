import React, { useEffect, useState } from "react";
import "../styles/normalize.css";
import "../styles/game.css";
import "../styles/Lobbies.css";
import { useNavigate, Link } from "react-router-dom";
import Chat from "../components/ChatGame";
import ConnectedUsersInGame from "../components/ConnectedUsersInGame";
import CodeMirror from "../components/CodeMirror";

function Game() {
  const [lobbyName, setLobbyName] = useState("");
  const [colorTema, setColorTema] = useState(false);
  const [code, setCode] = useState("function yourCode(input){ \n  //code here \n  return input;\n}");
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
        setCode("function yourCode(input){ \n  //code here \n  return input;\n}");
        break;

      case 'game_over-event':
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
        //
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
          let x = qst.testInput1;
          // console.log(code);
          console.log(res)
          // console.log(qst.input);
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
              <CodeMirror code={code} setCode={setCode}></CodeMirror>
              {/* {Array.isArray(qst.inputs[0]) && `let input = [${qst.inputs[0].toString()}];`}
              {!Array.isArray(qst.inputs[0]) && `let input = "${qst.inputs[0].toString()}";`}<br /> */}
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
