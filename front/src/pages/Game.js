import React, { useEffect, useState } from "react";
import "../normalize.css";
import "../game.css";
import "../Lobbies.css";
import routes from "../index";
import Chat from "../components/Chat";

function Game({ socket }) {
  const [messages, setMessages] = useState([]);
  const [colorTema, setColorTema] = useState(false);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [qst, setQst] = useState({
    statement: "",
    inputs: [""],
    output: "",
  });
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [winnerMessage, setWinnerMessage] = useState("");
  const [inputQuestion, setInputQuestion] = useState("");
  const [finished, setFinished] = useState(false);
  const [playable, setPlayable] = useState(true);
  const [rewards, setRewards] = useState({
    xpEarned: "",
    coinsEarned: "",
    eloEarned: "",
  });

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
          console.log(qst.inputs[1]);
          // let x = qst.testInput1;
          console.log(code);
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

      socket.emit("check_answer", {
        resultsEval: resultsEval,
        evalPassed: evalPassed,
      });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (msg != "") {
      socket.emit("chat message", {
        message: msg
      });
      setMsg("");
    }
  };

  useEffect(() => {
    socket.on("lobby-message", function (data) {
      setMessages(data.messages);
    });

    socket.on("question_data", function (data) {
      setQst(data);
      setCode("");
      setInputQuestion(qst.inputs[0])
    });

    socket.on("game_over", function (data) {
      console.log(data.message);
      setWinnerMessage(data.message);
      setPlayable(false)
    });

    socket.on("user_finished", function (data) {
      console.log(data);
      setFinished(true);
      setResult(data.message);
      setPlayable(false)
    });

    socket.on("stats", (data) => {
      console.log(data);
      setRewards({
        xpEarned: data.xpEarned,
        coinsEarned: data.coinsEarned,
        eloEarned: data.eloEarned,
      })
    })
  }, []);

  useEffect(() => {
    console.log(qst);
  }, [qst]);

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
    <div className="game">
      {!playable && <div>
        <h1>{result}</h1>
        <h2>{winnerMessage}</h2>
        <ul>
          <li>XP: {rewards.xpEarned}</li>
          <li>Coins: {rewards.coinsEarned}</li>
          <li>Elo: {rewards.eloEarned}</li>
        </ul>
        <p>
          <button className="pixel-button">GO BACK TO LOBBY</button>
          <button className="pixel-button">LOBBY LIST</button>
        </p>
      </div>}
      {playable && <div>
        <div className="game__statement">
          <h2>Statement:</h2>
          <h1 className="game__statementTitle">{qst.statement}</h1>
        </div>
        <div className="game--grid">
          <div className="game__expectedInput">
            <h2>Our input:</h2>
            <h1>{qst.inputs[0].toString()}</h1>
          </div>
          <div className="game__expectedOutput">
            <h2>Expected output:</h2>
            <h1>{qst.output.toString()}</h1>
          </div>
        </div>
        <form className="editor" onSubmit={handleSubmit}>
          <div className="input-header">
            <h1>Input</h1>
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
            {`let input = [${qst.inputs[0].toString()}];`}<br />
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
            ></textarea><br />
            {"return input;"}<br />
            {"}"}<br />
            {"yourCode(input);"}
            <div></div>
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
      {/* Chat uwu */}
      {/* <div className="lobby__chat chat">
        <h3 className="chat__title">Game chat</h3>
        <div className="chat__body">
          <Chat className="chat__chatbox" messages={messages}></Chat>
        </div>
        <form id="form" onSubmit={handleSendMessage}>
          <input
            id="input_message"
            autoComplete="off"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button>Send</button>
        </form>
      </div> */}
      {/* fin del chat uwu */}
    </div >
  );
}

export default Game;
