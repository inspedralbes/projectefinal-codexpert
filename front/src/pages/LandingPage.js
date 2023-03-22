import "../normalize.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import routes from "../index";
import logo from "../img/logo.gif";

function App() {
  const cookies = new Cookies();
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const token = new FormData();
    if (document.cookie.indexOf("token" + "=") == 0) {
      //Si existe token en cookies hace la comprobación (sino da error)
      token.append("token", cookies.get("token"));
      fetch(routes.fetchLaravel + "/index.php/isUserLogged", {
        method: "POST",
        mode: "cors",
        body: token,
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setLogin(true);
          }
        });
    }
  }, []);
  return (
    <div>
      <div className="landingPage">
        <img src={logo} alt="codeXpert"></img>
        <p>
          Welcome to{" "}
          <b>
            code<mark>X</mark>pert
          </b>
          , where your dreams come true.
        </p>

        {/* <p className="landingPage__codexpert">CODEPERT</p> */}
        <br />
        {!login && (
          <Link to="/login">
            <button className="pixel-button">Get Started</button>
          </Link>
        )}
        {login && (
          <Link to="/lobbies">
            <button className="pixel-button">Lobbies</button>
          </Link>
        )}
      </div>
      <div className="blog">
        <h1>Blog</h1>
        <h2>Welcome to the best competitive online programming game!</h2>
        <div>
          <ul>
            <h3>The Benefits of Learning to Code: Why It's a Skill Worth Acquiring</h3>
            <p>Coding, or computer programming, is the process of designing and building computer programs. It's a skill that is becoming increasingly important in today's technology-driven world. Whether you're interested in pursuing a career in technology or simply want to learn a new skill, there are many benefits to learning to code. Here are just a few reasons why coding is a skill worth acquiring.</p>
          </ul>
          <ol>
            <li>High Demand for Coders</li>
            <p>The demand for computer programmers is at an all-time high. According to the Bureau of Labor Statistics, the employment of computer and information technology occupations is projected to grow 11% from 2019 to 2029, much faster than the average for all occupations. This means that there are many job opportunities available for those with coding skills. In addition, coding skills are also in demand in non-technical fields such as finance, healthcare, and marketing.</p>
            <br/>
            <li>Lucrative Career Opportunities</li>
            <p>In addition to high demand, coding skills can lead to lucrative career opportunities. According to Glassdoor, the average base pay for a software engineer in the United States is over $90,000 per year. With experience and advanced skills, this salary can increase significantly. In addition, there are many opportunities for freelancing and starting your own business as a coder.</p>
            <br/>
            <li>Develop Problem-Solving Skills</li>
            <p>Coding involves breaking down complex problems into smaller, more manageable parts. This requires logical thinking, attention to detail, and the ability to troubleshoot and debug. By learning to code, you develop problem-solving skills that are valuable in many aspects of life, including school, work, and personal projects.</p>
            <br/>
            <li>Increase Creativity</li>
            <p>Coding also allows for creativity and innovation. As a programmer, you have the freedom to create something entirely new, whether it's a game, app, or website. Learning to code can help you develop a creative mindset and give you the tools to turn your ideas into reality.</p>
            <br/>
          </ol>
        </div>
        <div>
          <ul>
            <h3>Interactive Learning: Why Playing Is Essential for Knowledge Acquisition</h3>
            <p>Learning doesn't have to be a chore. In fact, when done right, it can be downright enjoyable. The key is to incorporate interactive play into the process. Playing can be an incredibly powerful tool for knowledge acquisition, especially in younger children. It helps to develop cognitive, emotional, and social skills, all while having fun. But the benefits of interactive learning don't stop there. Here's why playing is so important for knowledge acquisition.</p>
          </ul>
          <ol>
            <li>Engaging and Fun</li>
            <p>Interactive learning is often more engaging than traditional learning methods. Children who enjoy the learning process are more likely to stay focused and retain information. When children are having fun, they are more open to learning new things. Interactive play can take many forms, from board games to video games, from arts and crafts to role-playing games. The possibilities are endless. By making learning fun, you can foster a lifelong love of learning.</p>
            <br/>
            <li>Hands-On Learning</li>
            <p>Interactive play is a hands-on learning experience. It allows children to experiment and explore, to learn by doing. Children can use all their senses to understand a concept, not just relying on visual aids or listening to a teacher talk. For example, building blocks allow children to explore engineering concepts like balance and stability, while playing with puzzles helps develop problem-solving skills. Hands-on learning makes concepts more concrete and easier to understand.</p>
            <br/>
            <li>Social Interaction</li>
            <p>Interactive play also encourages social interaction. Children can learn to work together, to share, to take turns, and to negotiate. These are crucial social skills that are necessary for success in school and beyond. Playing with others helps children develop empathy and understand the perspectives of others. It also helps to build a sense of community and belonging.</p>
            <br/>
            <li>Promotes Creativity</li>
            <p>Interactive play can also promote creativity. Children can create their own stories, design their own games, and express themselves through art. Creativity is a valuable skill that can be applied to many aspects of life, including problem-solving and innovation. When children are allowed to use their imagination, they can come up with unique and innovative solutions to problems.</p>
            <br/>
            <li>Boosts Memory and Retention</li>
            <p>Finally, interactive play can boost memory and retention. When children are actively engaged in the learning process, they are more likely to remember what they have learned. Playing games that involve repetition, such as memory games, can help children remember information. Interactive play can also help children retain information in the long term, rather than just memorizing it for a test.</p>
            <br/>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;
