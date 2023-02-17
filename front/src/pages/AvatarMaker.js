import React, { useEffect, useState } from "react";
import routes from "../index"
import '../avatarMaker.css';
import { CirclePicker } from "react-color";
import { useNavigate } from "react-router-dom"; //Rutas
import Cookies from 'universal-cookie';


function AvatarMaker({ socket }) {
  const cookies = new Cookies();
  const navigate = useNavigate();
  let urlStr = "";
  const [optionCopy, setOptionCopy] = useState("");
  const [save, setSave] = useState(0);
  const [avatar, setAvatar] = useState("");

  const [menu, setMenu] = useState({
    background: true,
    cloth: false,
    hair: false,
    skinColor: false,
    glasses: false,
    accessories: false,
    mouth: false,
    eyes: false,
  });

  const [changes, setChanges] = useState({
    seed: "",
    bg: "FFFFFF",
    c: "variant12",
    cC: "ff6f69",
    h: "short19",
    hC: "ffdbac",
    sC: "ffdbac",
    g: "dark01",
    gC: "4b4b4b",
    gP: "0",
    a: "variant01",
    aC: "a9a9a9",
    aP: "0",
    m: "happy09",
    mC: "c98276",
    e: "variant09",
    eC: "5b7c8b",
  });


  // COLOR PICKER
  const [currentColor, setCurrentColor] = useState("#fff");

  const handleChangeComplete = (color) => {
    setCurrentColor(color);
  };

  const ArrayColors = ['#000000', '#2D2D2D', '#595858', '#969696', '#C1C1C1', '#F1F1F1', '#41240B', '#6C3F18', '#8B5B30', '#AE7A4C', '#CC9D74', '#E9C2A0', '#eb8d02', '#FFC107', '#FFEB3B', '#FFF06F', '#FFF176', '#FFF8B7', '#E65100', '#FB6310', '#F57C00', '#FF9800', '#FFB74D', '#FFE0B2', '#FF0000', '#FC3030', '#FF5959', '#FD7B7B', '#FE9C9C', '#FEBDBD', '#FD0082', '#FE339C', '#FE52AB', '#FB89C4', '#FCA3D1', '#FFBEDF', '#C700ff', '#D235FE', '#D957FE', '#E27CFF', '#E797FD', '#EEB1FF', '#8500FF', '#9D32FF', '#A747FF', '#B466FC', '#C98DFF', '#DEBAFF', '#0200FF', '#2B29FE', '#4D4BFC', '#6362FE', '#7978FD', '#9897FE', '#00ABFF', '#30BBFF', '#53C7FF', '#71D0FF', '#96DBFD', '#BDE8FD', '#00FFA6', '#31FEB6', '#56FDC3', '#8CFFD7', '#A5FEDF', '#C7FEEB', '#00FF28', '#2CFD4D', '#4FFB6A', '#74FB89', '#93FBA3', '#B0FBBC', '#33691E', '#689F38', '#77B541', '#8BC34A', '#AED581', '#DCEDC8', '#827717', '#968A1C', '#AFB42B', '#C5CA38', '#CDDC39', '#DCE775', '#5B4202', '#846205', '#AF8003', '#C89A1D', '#DAAD34', '#EAC050'];

  // FIN DEL COLOR PICKER

  useEffect(() => {
    const fetchData = async () => {
      const token = new FormData()
      token.append("token", cookies.get('token'))
      await fetch(routes.fetchLaravel + "/index.php/getAvatar", {
        method: "POST",
        mode: "cors",
        body: token,
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          urlStr = data.url;
          //urlStr = "https://api.dicebear.com/5.x/pixel-art/svg?seed=&backgroundColor=FFFFFF&clothing=variant12&clothingColor=ff6f69&hair=short19&hairColor=6E260E&skinColor=ffdbac&glasses=dark01&glassesColor=4b4b4b&glassesProbability=0&accessories=variant01&accessoriesColor=a9a9a9&accessoriesProbability=0&mouth=happy09&mouthColor=c98276&eyes=variant01&eyesColor=5b7c8b";
          if (urlStr !== null) {
            getAvatar(urlStr);
          } else {
            navigate("/login");
          }
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (avatar != "") {
      setAvatar(
        "https://api.dicebear.com/5.x/pixel-art/svg?seed=" +
        changes.seed +
        "&backgroundColor=" +
        changes.bg +
        "&clothing=" +
        changes.c +
        "&clothingColor=" +
        changes.cC +
        "&hair=" +
        changes.h +
        "&hairColor=" +
        changes.hC +
        "&skinColor=" +
        changes.sC +
        "&glasses=" +
        changes.g +
        "&glassesColor=" +
        changes.gC +
        "&glassesProbability=" +
        changes.gP +
        "&accessories=" +
        changes.a +
        "&accessoriesColor=" +
        changes.aC +
        "&accessoriesProbability=" +
        changes.aP +
        "&mouth=" +
        changes.m +
        "&mouthColor=" +
        changes.mC +
        "&eyes=" +
        changes.e +
        "&eyesColor=" +
        changes.eC
      );
    }
  }, [changes]);

  function changeOption(option) {
    if (option != optionCopy) {
      setOptionCopy(option);
      const menuCopy = { ...menu };
      const changeOption = !menuCopy[option];
      Object.keys(menuCopy).forEach((key) => (menuCopy[key] = false));
      menuCopy[option] = changeOption;
      console.log(menuCopy);
      setMenu(menuCopy);
    }
  }

  function getAvatar(u) {
    const url = new URL(u);
    setChanges({
      ...changes,
      bg: url.searchParams.get("backgroundColor"),
      c: url.searchParams.get("clothing"),
      cC: url.searchParams.get("clothingColor"),
      h: url.searchParams.get("hair"),
      hC: url.searchParams.get("hairColor"),
      sC: url.searchParams.get("skinColor"),
      g: url.searchParams.get("glasses"),
      gC: url.searchParams.get("glassesColor"),
      gP: url.searchParams.get("glassesProbability"),
      a: url.searchParams.get("accessories"),
      aC: url.searchParams.get("accessoriesColor"),
      aP: url.searchParams.get("accessoriesProbability"),
      m: url.searchParams.get("mouth"),
      mC: url.searchParams.get("mouthColor"),
      e: url.searchParams.get("eyes"),
      eC: url.searchParams.get("eyesColor"),
    });

    setAvatar(
      "https://api.dicebear.com/5.x/pixel-art/svg?seed=" +
      "" +
      "&backgroundColor=" +
      url.searchParams.get("backgroundColor") +
      "&clothing=" +
      url.searchParams.get("clothing") +
      "&clothingColor=" +
      url.searchParams.get("clothingColor") +
      "&hair=" +
      url.searchParams.get("hair") +
      "&hairColor=" +
      url.searchParams.get("hairColor") +
      "&skinColor=" +
      url.searchParams.get("skinColor") +
      "&glasses=" +
      url.searchParams.get("glasses") +
      "&glassesColor=" +
      url.searchParams.get("glassesColor") +
      "&glassesProbability=" +
      url.searchParams.get("glassesProbability") +
      "&accessories=" +
      url.searchParams.get("accessories") +
      "&accessoriesColor=" +
      url.searchParams.get("accessoriesColor") +
      "&accessoriesProbability=" +
      url.searchParams.get("accessoriesProbability") +
      "&mouth=" +
      url.searchParams.get("mouth") +
      "&mouthColor=" +
      url.searchParams.get("mouthColor") +
      "&eyes=" +
      url.searchParams.get("eyes") +
      "&eyesColor=" +
      url.searchParams.get("eyesColor")
    );
  }

  useEffect(() => {
    if (save > 0) {
      const sendAvatar = new FormData();
      sendAvatar.append("newAvatar", avatar);
      sendAvatar.append("token", cookies.get('token'))
      const fetchData = async () => {
        await fetch(routes.fetchLaravel + "/index.php/setAvatar", {
          method: "POST",
          mode: "cors",
          body: sendAvatar,
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            if (cookies.get("token") != undefined) {
              socket.emit("send token", {
                token: cookies.get("token"),
              });
            }
          });
      };
      fetchData();
      navigate("/lobbies");
    }
  }, [save]);

  if (avatar !== "") {
    return (
      <div className="Avatar">
        <div className="avatar__left">
          <img className="avatar__img" src={avatar} alt="avatar" />
          <br />
          <button className="avatar__menu-btn" onClick={() => setSave(save + 1)}>Save</button>

        </div>
        <div className="avatar__right">

          <div className="avatar__menu">
            <button className="avatar__menu-btn" onClick={() => changeOption("background")}>Background</button>
            <button className="avatar__menu-btn" onClick={() => changeOption("cloth")}>Cloth</button>
            <button className="avatar__menu-btn" onClick={() => changeOption("hair")}>Hair</button>
            <button className="avatar__menu-btn" onClick={() => changeOption("skinColor")}>Skin Color</button>
            <button className="avatar__menu-btn" onClick={() => changeOption("glasses")}>Glasses</button>
            <button className="avatar__menu-btn" onClick={() => changeOption("accessories")}>Accessories</button>
            <button className="avatar__menu-btn" onClick={() => changeOption("mouth")}>Mouth</button>
            <button className="avatar__menu-btn" onClick={() => changeOption("eyes")}>Eyes</button>
          </div>
          {menu.background && (
            <div>
              <div className="avatar__colorPicker">

                <CirclePicker
                  color={currentColor}
                  onChangeComplete={handleChangeComplete}
                  onChange={(color) =>
                    setChanges({ ...changes, bg: color.hex.replace("#", "") })
                  }
                  colors={ArrayColors}
                />
              </div>
              <div className="avatar__options"><h1>This element has no type uwu</h1></div>

            </div>
          )}
          {menu.cloth && (
            <>
              <div className="avatar__colorPicker">
                <CirclePicker
                  color={currentColor}
                  onChangeComplete={handleChangeComplete}
                  onChange={(color) =>
                    setChanges({ ...changes, cC: color.hex.replace("#", "") })
                  }
                  colors={ArrayColors}
                />
              </div>
              <div className="avatar__options">
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant01" })}>
                  <img src={require('../img/avatar/cloth/variant01.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant02" })}>
                  <img src={require('../img/avatar/cloth/variant02.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant03" })}>
                  <img src={require('../img/avatar/cloth/variant03.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant04" })}>
                  <img src={require('../img/avatar/cloth/variant04.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant05" })}>
                  <img src={require('../img/avatar/cloth/variant05.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant06" })}>
                  <img src={require('../img/avatar/cloth/variant06.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant07" })}>
                  <img src={require('../img/avatar/cloth/variant07.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant08" })}>
                  <img src={require('../img/avatar/cloth/variant08.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant09" })}>
                  <img src={require('../img/avatar/cloth/variant09.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant10" })}>
                  <img src={require('../img/avatar/cloth/variant10.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant11" })}>
                  <img src={require('../img/avatar/cloth/variant11.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant12" })}>
                  <img src={require('../img/avatar/cloth/variant12.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant13" })}>
                  <img src={require('../img/avatar/cloth/variant13.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant14" })}>
                  <img src={require('../img/avatar/cloth/variant14.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant15" })}>
                  <img src={require('../img/avatar/cloth/variant15.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant16" })}>
                  <img src={require('../img/avatar/cloth/variant16.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant17" })}>
                  <img src={require('../img/avatar/cloth/variant17.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant18" })}>
                  <img src={require('../img/avatar/cloth/variant18.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant19" })}>
                  <img src={require('../img/avatar/cloth/variant19.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant20" })}>
                  <img src={require('../img/avatar/cloth/variant20.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant21" })}>
                  <img src={require('../img/avatar/cloth/variant21.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant22" })}>
                  <img src={require('../img/avatar/cloth/variant22.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
                <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, c: "variant23" })}>
                  <img src={require('../img/avatar/cloth/variant23.png')} alt="Cloth" width='100px' height='100px'></img>
                </button>
              </div>
            </>
          )
          }
          {
            menu.hair && (
              <>
                <div className="avatar__colorPicker">

                  <CirclePicker
                    color={currentColor}
                    onChangeComplete={handleChangeComplete}
                    onChange={(color) =>
                      setChanges({ ...changes, hC: color.hex.replace("#", "") })
                    }
                    colors={ArrayColors}
                  />
                </div>
                <div className="avatar__options">
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long01" })}>
                    <img src={require('../img/avatar/hair/long01.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long02" })}>
                    <img src={require('../img/avatar/hair/long02.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long03" })}>
                    <img src={require('../img/avatar/hair/long03.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long04" })}>
                    <img src={require('../img/avatar/hair/long04.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long05" })}>
                    <img src={require('../img/avatar/hair/long05.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long06" })}>
                    <img src={require('../img/avatar/hair/long06.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long07" })}>
                    <img src={require('../img/avatar/hair/long07.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long08" })}>
                    <img src={require('../img/avatar/hair/long08.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long09" })}>
                    <img src={require('../img/avatar/hair/long09.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long10" })}>
                    <img src={require('../img/avatar/hair/long10.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long11" })}>
                    <img src={require('../img/avatar/hair/long11.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long12" })}>
                    <img src={require('../img/avatar/hair/long12.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long13" })}>
                    <img src={require('../img/avatar/hair/long13.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long14" })}>
                    <img src={require('../img/avatar/hair/long14.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long15" })}>
                    <img src={require('../img/avatar/hair/long15.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long16" })}>
                    <img src={require('../img/avatar/hair/long16.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long17" })}>
                    <img src={require('../img/avatar/hair/long17.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long18" })}>
                    <img src={require('../img/avatar/hair/long18.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long19" })}>
                    <img src={require('../img/avatar/hair/long19.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long20" })}>
                    <img src={require('../img/avatar/hair/long20.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "long21" })}>
                    <img src={require('../img/avatar/hair/long21.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short01" })}>
                    <img src={require('../img/avatar/hair/short01.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short02" })}>
                    <img src={require('../img/avatar/hair/short02.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short03" })}>
                    <img src={require('../img/avatar/hair/short03.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short04" })}>
                    <img src={require('../img/avatar/hair/short04.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short05" })}>
                    <img src={require('../img/avatar/hair/short05.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short06" })}>
                    <img src={require('../img/avatar/hair/short06.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short07" })}>
                    <img src={require('../img/avatar/hair/short07.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short08" })}>
                    <img src={require('../img/avatar/hair/short08.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short09" })}>
                    <img src={require('../img/avatar/hair/short09.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short10" })}>
                    <img src={require('../img/avatar/hair/short10.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short11" })}>
                    <img src={require('../img/avatar/hair/short11.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short12" })}>
                    <img src={require('../img/avatar/hair/short12.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short13" })}>
                    <img src={require('../img/avatar/hair/short13.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short14" })}>
                    <img src={require('../img/avatar/hair/short14.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short15" })}>
                    <img src={require('../img/avatar/hair/short15.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short16" })}>
                    <img src={require('../img/avatar/hair/short16.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short17" })}>
                    <img src={require('../img/avatar/hair/short17.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short18" })}>
                    <img src={require('../img/avatar/hair/short18.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short19" })}>
                    <img src={require('../img/avatar/hair/short19.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short20" })}>
                    <img src={require('../img/avatar/hair/short20.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short21" })}>
                    <img src={require('../img/avatar/hair/short21.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short22" })}>
                    <img src={require('../img/avatar/hair/short22.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short23" })}>
                    <img src={require('../img/avatar/hair/short23.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, h: "short24" })}>
                    <img src={require('../img/avatar/hair/short24.png')} alt="Hair" width='100px' height='100px'></img>
                  </button>
                </div>
              </>
            )
          }
          {
            menu.skinColor && (
              <div>
                <div className="avatar__colorPicker">
                  <CirclePicker
                    color={currentColor}
                    onChangeComplete={handleChangeComplete}
                    onChange={(color) =>
                      setChanges({ ...changes, sC: color.hex.replace("#", "") })
                    }
                    colors={ArrayColors}
                  />
                </div>
                <div className="avatar__options"><h1>This element has no type uwu</h1></div>
              </div>

            )
          }
          {
            menu.glasses && (
              <>
                <div className="avatar__colorPicker">
                  <CirclePicker
                    color={currentColor}
                    onChangeComplete={handleChangeComplete}
                    onChange={(color) =>
                      setChanges({ ...changes, gC: color.hex.replace("#", "") })
                    }
                    colors={ArrayColors}
                  />
                </div>
                <div className="avatar__options">

                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, gP: "0" })}>
                    <img src={require('../img/x.png')} alt="No Glasses" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, g: "dark01", gP: "100" })}>
                    <img src={require('../img/avatar/glasses/dark01.png')} alt="Glasses" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, g: "dark02", gP: "100" })}>
                    <img src={require('../img/avatar/glasses/dark02.png')} alt="Glasses" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, g: "dark03", gP: "100" })}>
                    <img src={require('../img/avatar/glasses/dark03.png')} alt="Glasses" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, g: "dark04", gP: "100" })}>
                    <img src={require('../img/avatar/glasses/dark04.png')} alt="Glasses" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, g: "dark05", gP: "100" })}>
                    <img src={require('../img/avatar/glasses/dark05.png')} alt="Glasses" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, g: "dark06", gP: "100" })}>
                    <img src={require('../img/avatar/glasses/dark06.png')} alt="Glasses" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, g: "dark07", gP: "100" })}>
                    <img src={require('../img/avatar/glasses/dark07.png')} alt="Glasses" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, g: "light01", gP: "100" })}>
                    <img src={require('../img/avatar/glasses/light01.png')} alt="Glasses" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, g: "light02", gP: "100" })}>
                    <img src={require('../img/avatar/glasses/light02.png')} alt="Glasses" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, g: "light03", gP: "100" })}>
                    <img src={require('../img/avatar/glasses/light03.png')} alt="Glasses" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, g: "light04", gP: "100" })}>
                    <img src={require('../img/avatar/glasses/light04.png')} alt="Glasses" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, g: "light05", gP: "100" })}>
                    <img src={require('../img/avatar/glasses/light05.png')} alt="Glasses" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, g: "light06", gP: "100" })}>
                    <img src={require('../img/avatar/glasses/light06.png')} alt="Glasses" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, g: "light07", gP: "100" })}>
                    <img src={require('../img/avatar/glasses/light07.png')} alt="Glasses" width='100px' height='100px'></img>
                  </button>
                </div>
              </>
            )
          }
          {
            menu.accessories && (
              <>
                <div className="avatar__colorPicker">
                  <CirclePicker
                    color={currentColor}
                    onChangeComplete={handleChangeComplete}
                    onChange={(color) =>
                      setChanges({ ...changes, aC: color.hex.replace("#", "") })
                    }
                    colors={ArrayColors}
                  />
                </div>
                <div className="avatar__options">

                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, aP: "0" })}>
                    <img src={require('../img/x.png')} alt="No Accessories" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, a: "variant01", aP: "100" })} >
                    <img src={require('../img/avatar/accessories/variant01.png')} alt="Accessories" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, a: "variant02", aP: "100" })}>
                    <img src={require('../img/avatar/accessories/variant02.png')} alt="Accessories" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, a: "variant03", aP: "100" })}>
                    <img src={require('../img/avatar/accessories/variant03.png')} alt="Accessories" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, a: "variant04", aP: "100" })}>
                    <img src={require('../img/avatar/accessories/variant04.png')} alt="Accessories" width='100px' height='100px'></img>
                  </button>
                </div>
              </>
            )
          }
          {
            menu.mouth && (
              <>
                <div className="avatar__colorPicker">
                  <CirclePicker
                    color={currentColor}
                    onChangeComplete={handleChangeComplete}
                    onChange={(color) => setChanges({ ...changes, mC: color.hex.replace("#", "") })
                    }
                    colors={ArrayColors}
                  />
                </div>
                <div className="avatar__options">

                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "happy01" })}>
                    <img src={require('../img/avatar/mouth/happy01.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "happy02" })}>
                    <img src={require('../img/avatar/mouth/happy02.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "happy03" })}>
                    <img src={require('../img/avatar/mouth/happy03.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "happy04" })}>
                    <img src={require('../img/avatar/mouth/happy04.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "happy05" })}>
                    <img src={require('../img/avatar/mouth/happy05.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "happy06" })}>
                    <img src={require('../img/avatar/mouth/happy06.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "happy07" })}>
                    <img src={require('../img/avatar/mouth/happy07.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "happy08" })}>
                    <img src={require('../img/avatar/mouth/happy08.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "happy09" })}>
                    <img src={require('../img/avatar/mouth/happy09.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "happy10" })}>
                    <img src={require('../img/avatar/mouth/happy10.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "happy11" })}>
                    <img src={require('../img/avatar/mouth/happy11.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "happy12" })}>
                    <img src={require('../img/avatar/mouth/happy12.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "happy13" })}>
                    <img src={require('../img/avatar/mouth/happy13.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "sad01" })}>
                    <img src={require('../img/avatar/mouth/sad01.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "sad02" })}>
                    <img src={require('../img/avatar/mouth/sad02.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "sad03" })}>
                    <img src={require('../img/avatar/mouth/sad03.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "sad04" })}>
                    <img src={require('../img/avatar/mouth/sad04.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "sad05" })}>
                    <img src={require('../img/avatar/mouth/sad05.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "sad06" })}>
                    <img src={require('../img/avatar/mouth/sad06.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "sad07" })}>
                    <img src={require('../img/avatar/mouth/sad07.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "sad08" })}>
                    <img src={require('../img/avatar/mouth/sad08.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "sad09" })}>
                    <img src={require('../img/avatar/mouth/sad09.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, m: "sad10" })}>
                    <img src={require('../img/avatar/mouth/sad10.png')} alt="Mouth" width='100px' height='100px'></img>
                  </button>
                </div>
              </>
            )
          }
          {
            menu.eyes && (
              <>
                <div className="avatar__colorPicker">

                  <CirclePicker
                    color={currentColor}
                    onChangeComplete={handleChangeComplete}
                    onChange={(color) =>
                      setChanges({ ...changes, eC: color.hex.replace("#", "") })
                    }
                    colors={ArrayColors}
                  />
                </div>
                <div className="avatar__options">
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant01" })}>
                    <img src={require('../img/avatar/eyes/variant01.png')} alt="Eyes" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant02" })}>
                    <img src={require('../img/avatar/eyes/variant02.png')} alt="Eyes" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant03" })}>
                    <img src={require('../img/avatar/eyes/variant03.png')} alt="Eyes" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant04" })}>
                    <img src={require('../img/avatar/eyes/variant04.png')} alt="Eyes" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant05" })}>
                    <img src={require('../img/avatar/eyes/variant05.png')} alt="Eyes" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant06" })}>
                    <img src={require('../img/avatar/eyes/variant06.png')} alt="Eyes" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant07" })}>
                    <img src={require('../img/avatar/eyes/variant07.png')} alt="Eyes" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant08" })}>
                    <img src={require('../img/avatar/eyes/variant08.png')} alt="Eyes" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant09" })}>
                    <img src={require('../img/avatar/eyes/variant09.png')} alt="Eyes" width='100px' height='100px'></img>
                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant10" })}>
                    <img src={require('../img/avatar/eyes/variant10.png')} alt="Eyes" width='100px' height='100px'></img>

                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant11" })}>
                    <img src={require('../img/avatar/eyes/variant11.png')} alt="Eyes" width='100px' height='100px'></img>

                  </button>
                  <button className="avatar__optionsButton" onClick={() => setChanges({ ...changes, e: "variant12" })}>
                    <img src={require('../img/avatar/eyes/variant12.png')} alt="Eyes" width='100px' height='100px'></img>
                  </button>
                </div>
              </>
            )
          }
        </div >

      </div >
    );
  }
  return <div className="Avatar"> </div>;
}

export default AvatarMaker;
