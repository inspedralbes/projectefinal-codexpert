import React, { useEffect, useState } from "react";
import "../normalize.css";
import "../game.css";
import "../Lobbies.css";
import routes from "../index";
import Chat from "../components/Chat";

function Game({ socket }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [qst, setQst] = useState({
    statement: "",
    inputs: [""],
    output: "",
  });
  const [messages, setMessages] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [winnerMessage, setWinnerMessage] = useState("");
  const [finished, setFinished] = useState(false);
  const [playable, setPlayable] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code != "") {
      let resultsEval = [];
      let evalPassed = true;
      qst.inputs.forEach((inp) => {
        let x = inp;
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
        message: msg,
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
  }, []);

  return (
    <div className="game">
      {!playable && <div>
        <h1>{result}</h1>
        <h2>{winnerMessage}</h2>
        <p>
          <button>GO BACK TO LOBBY</button>
          <button>LOBBY LIST</button>
        </p>
      </div>}
      {playable && <div>
        <div className="game__statement">
          <h1 className="game__statementTitle">{qst.statement}</h1>
        </div>
        <div className="game--grid">
          <div className="game__expectedInput">
            <h1>{qst.inputs[0].toString()}</h1>
          </div>
          <div className="game__expectedOutput">
            <h1>{qst.output.toString()}</h1>
          </div>
        </div>
        <form className="editor" onSubmit={handleSubmit}>
          <div className="input-header">
            <h1>Input</h1>
          </div>
          <div className="file-window js-view">
            let x = [{qst.inputs[0].toString()}]
            <div className="line-numbers">
              1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />
              10<br />11<br />12<br />13<br />14<br />15<br />16<br />17<br />18<br />19<br />20
            </div>
            <textarea
              className="input-strobe"
              type="text"
              value={code}
              placeholder="Type in your code :)"
              onChange={(e) => {
                setCode(e.target.value);
              }}
            ></textarea>
            <div></div>
            <div className="help">
              <br />
            /* <br />
              This is your code input.
              <br />
              You can, we trust you!! <br />
              */
            </div>
          </div>

          <button className="game__submit" disabled={finished}>
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
    </div>
  );
}

export default Game;
