import React, { useEffect, useState } from "react";
import routeFetch from "../index";
import '../avatarMaker.css';
import { CirclePicker } from "react-color";
import { ChromePicker } from "react-color";


function AvatarMaker() {
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

  const ArrayColors = ['#000000', '#2D2D2D', '#595858', '#969696', '#C1C1C1', '#F1F1F1', '#41240B', '#6C3F18', '#8B5B30', '#AE7A4C', '#CC9D74', '#E9C2A0', '#FF9800', '#FFC107', '#FFEB3B', '#FFF06F', '#FFF176', '#FFF8B7', '#E65100', '#FB6310', '#F57C00', '#FF9800', '#FFB74D', '#FFE0B2', '#FF0000', '#FC3030', '#FF5959', '#FD7B7B', '#FE9C9C', '#FE9C9C', '#FD0082', '#FE339C', '#FE52AB', '#FB89C4', '#FCA3D1', '#FFBEDF', '#C700ff', '#D235FE', '#D957FE', '#E27CFF', '#E797FD', '#EEB1FF', '#8500FF', '#9D32FF', '#A747FF', '#B466FC', '#C98DFF', '#DEBAFF', '#0200FF', '#2B29FE', '#4D4BFC', '#6362FE', '#7978FD', '#9897FE', '#00ABFF', '#30BBFF', '#53C7FF', '#71D0FF', '#96DBFD', '#BDE8FD', '#00FFA6', '#31FEB6', '#56FDC3', '#8CFFD7', '#A5FEDF', '#C7FEEB', '#00FF28', '#2CFD4D', '#4FFB6A', '#74FB89', '#93FBA3', '#B0FBBC', '#33691E', '#689F38', '#77B541', '#8BC34A', '#AED581', '#DCEDC8', '#827717', '#968A1C', '#AFB42B', '#C5CA38', '#CDDC39', '#DCE775', '#5B4202', '#846205', '#AF8003', '#C89A1D', '#DAAD34', '#EAC050'];

  // FIN DEL COLOR PICKER

  useEffect(() => {
    const fetchData = async () => {
      await fetch(routeFetch + "/index.php/getAvatar", {
        method: "POST",
        mode: "cors",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          urlStr = data.url;
          //urlStr = "https://api.dicebear.com/5.x/pixel-art/svg?seed=&backgroundColor=FFFFFF&clothing=variant12&clothingColor=ff6f69&hair=short19&hairColor=6E260E&skinColor=ffdbac&glasses=dark01&glassesColor=4b4b4b&glassesProbability=0&accessories=variant01&accessoriesColor=a9a9a9&accessoriesProbability=0&mouth=happy09&mouthColor=c98276&eyes=variant01&eyesColor=5b7c8b";
          if (urlStr !== null) {
            getAvatar(urlStr);
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
      const fetchData = async () => {
        await fetch(routeFetch + "/index.php/setAvatar", {
          method: "POST",
          mode: "cors",
          body: sendAvatar,
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => { });
      };
      fetchData();
    }
  }, [save]);

  if (avatar !== "") {
    return (
      <div className="Avatar">
        <button className="avatar__menu" onClick={() => changeOption("background")}>Background</button>
        <button className="avatar__menu" onClick={() => changeOption("cloth")}>Cloth</button>
        <button className="avatar__menu" onClick={() => changeOption("hair")}>Hair</button>
        <button className="avatar__menu" onClick={() => changeOption("skinColor")}>Skin Color</button>
        <button className="avatar__menu" onClick={() => changeOption("glasses")}>Glasses</button>
        <button className="avatar__menu" onClick={() => changeOption("accessories")}>Accessories</button>
        <button className="avatar__menu" onClick={() => changeOption("mouth")}>Mouth</button>
        <button className="avatar__menu" onClick={() => changeOption("eyes")}>Eyes</button>
        <img className="avatar__img" src={avatar} alt="avatar" />
        {menu.background && (
          <div className="CirclePicker--overflow">

            <CirclePicker
              color={currentColor}
              onChangeComplete={handleChangeComplete}
              onChange={(color) =>
                setChanges({ ...changes, bg: color.hex.replace("#", "") })
              }
              colors={ArrayColors}
            />
          </div>
        )}
        {menu.cloth && (
          <>
            <div className="CirclePicker--overflow">
              <CirclePicker
                color={currentColor}
                onChangeComplete={handleChangeComplete}
                onChange={(color) =>
                  setChanges({ ...changes, cC: color.hex.replace("#", "") })
                }
                colors={ArrayColors}
              />
            </div>
            <button onClick={() => setChanges({ ...changes, c: "variant01" })}>
              Cloth 1
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant02" })}>
              Cloth 2
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant03" })}>
              Cloth 3
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant04" })}>
              Cloth 4
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant05" })}>
              Cloth 5
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant06" })}>
              Cloth 6
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant07" })}>
              Cloth 7
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant08" })}>
              Cloth 8
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant09" })}>
              Cloth 9
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant10" })}>
              Cloth 10
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant11" })}>
              Cloth 11
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant12" })}>
              Cloth 12
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant13" })}>
              Cloth 13
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant14" })}>
              Cloth 14
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant15" })}>
              Cloth 15
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant16" })}>
              Cloth 16
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant17" })}>
              Cloth 17
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant18" })}>
              Cloth 18
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant19" })}>
              Cloth 19
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant20" })}>
              Cloth 20
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant21" })}>
              Cloth 21
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant22" })}>
              Cloth 22
            </button>
            <button onClick={() => setChanges({ ...changes, c: "variant23" })}>
              Cloth 23
            </button>
          </>
        )
        }
        {
          menu.hair && (
            <>
              <div className="CirclePicker--overflow">

                <CirclePicker
                  color={currentColor}
                  onChangeComplete={handleChangeComplete}
                  onChange={(color) =>
                    setChanges({ ...changes, hC: color.hex.replace("#", "") })
                  }
                  colors={ArrayColors}
                />
              </div>
              <button onClick={() => setChanges({ ...changes, h: "long01" })}>
                Hair 1
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long02" })}>
                Hair 2
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long03" })}>
                Hair 3
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long04" })}>
                Hair 4
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long05" })}>
                Hair 5
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long06" })}>
                Hair 6
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long07" })}>
                Hair 7
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long08" })}>
                Hair 8
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long09" })}>
                Hair 9
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long10" })}>
                Hair 10
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long11" })}>
                Hair 11
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long12" })}>
                Hair 12
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long13" })}>
                Hair 13
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long14" })}>
                Hair 14
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long15" })}>
                Hair 15
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long16" })}>
                Hair 16
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long17" })}>
                Hair 17
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long18" })}>
                Hair 18
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long19" })}>
                Hair 19
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long20" })}>
                Hair 20
              </button>
              <button onClick={() => setChanges({ ...changes, h: "long21" })}>
                Hair 21
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short01" })}>
                Hair 22
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short02" })}>
                Hair 23
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short03" })}>
                Hair 24
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short04" })}>
                Hair 25
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short05" })}>
                Hair 26
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short06" })}>
                Hair 27
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short07" })}>
                Hair 28
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short08" })}>
                Hair 29
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short09" })}>
                Hair 30
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short10" })}>
                Hair 31
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short11" })}>
                Hair 32
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short12" })}>
                Hair 33
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short13" })}>
                Hair 34
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short14" })}>
                Hair 35
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short15" })}>
                Hair 36
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short16" })}>
                Hair 37
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short17" })}>
                Hair 38
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short18" })}>
                Hair 39
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short19" })}>
                Hair 40
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short20" })}>
                Hair 41
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short21" })}>
                Hair 42
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short22" })}>
                Hair 43
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short23" })}>
                Hair 44
              </button>
              <button onClick={() => setChanges({ ...changes, h: "short24" })}>
                Hair 45
              </button>
            </>
          )
        }
        {
          menu.skinColor && (
            <div className="CirclePicker--overflow">
              <CirclePicker
                color={currentColor}
                onChangeComplete={handleChangeComplete}
                onChange={(color) =>
                  setChanges({ ...changes, sC: color.hex.replace("#", "") })
                }
                colors={ArrayColors}
              />
            </div>
          )
        }
        {
          menu.glasses && (
            <>
              <div className="CirclePicker--overflow">
                <CirclePicker
                  color={currentColor}
                  onChangeComplete={handleChangeComplete}
                  onChange={(color) =>
                    setChanges({ ...changes, gC: color.hex.replace("#", "") })
                  }
                  colors={ArrayColors}
                />
              </div>
              <button onClick={() => setChanges({ ...changes, gP: "0" })}>
                No Glasses
              </button>
              <button
                onClick={() => setChanges({ ...changes, g: "dark01", gP: "100" })}
              >
                Glasses 1
              </button>
              <button
                onClick={() => setChanges({ ...changes, g: "dark02", gP: "100" })}
              >
                Glasses 2
              </button>
              <button
                onClick={() => setChanges({ ...changes, g: "dark03", gP: "100" })}
              >
                Glasses 3
              </button>
              <button
                onClick={() => setChanges({ ...changes, g: "dark04", gP: "100" })}
              >
                Glasses 4
              </button>
              <button
                onClick={() => setChanges({ ...changes, g: "dark05", gP: "100" })}
              >
                Glasses 5
              </button>
              <button
                onClick={() => setChanges({ ...changes, g: "dark06", gP: "100" })}
              >
                Glasses 6
              </button>
              <button
                onClick={() => setChanges({ ...changes, g: "dark07", gP: "100" })}
              >
                Glasses 7
              </button>
              <button
                onClick={() =>
                  setChanges({ ...changes, g: "light01", gP: "100" })
                }
              >
                Glasses 8
              </button>
              <button
                onClick={() =>
                  setChanges({ ...changes, g: "light02", gP: "100" })
                }
              >
                Glasses 9
              </button>
              <button
                onClick={() =>
                  setChanges({ ...changes, g: "light03", gP: "100" })
                }
              >
                Glasses 10
              </button>
              <button
                onClick={() =>
                  setChanges({ ...changes, g: "light04", gP: "100" })
                }
              >
                Glasses 11
              </button>
              <button
                onClick={() =>
                  setChanges({ ...changes, g: "light05", gP: "100" })
                }
              >
                Glasses 12
              </button>
              <button
                onClick={() =>
                  setChanges({ ...changes, g: "light06", gP: "100" })
                }
              >
                Glasses 12
              </button>
              <button
                onClick={() =>
                  setChanges({ ...changes, g: "light07", gP: "100" })
                }
              >
                Glasses 12
              </button>
            </>
          )
        }
        {
          menu.accessories && (
            <>
              <div className="CirclePicker--overflow">
                <CirclePicker
                  color={currentColor}
                  onChangeComplete={handleChangeComplete}
                  onChange={(color) =>
                    setChanges({ ...changes, aC: color.hex.replace("#", "") })
                  }
                  colors={ArrayColors}
                />
              </div>
              <button onClick={() => setChanges({ ...changes, aP: "0" })}>
                No accessories
              </button>
              <button
                onClick={() =>
                  setChanges({ ...changes, a: "variant01", aP: "100" })
                }
              >
                Accessories 1
              </button>
              <button
                onClick={() =>
                  setChanges({ ...changes, a: "variant02", aP: "100" })
                }
              >
                Accessories 2
              </button>
              <button
                onClick={() =>
                  setChanges({ ...changes, a: "variant03", aP: "100" })
                }
              >
                Accessories 3
              </button>
              <button
                onClick={() =>
                  setChanges({ ...changes, a: "variant04", aP: "100" })
                }
              >
                Accessories 4
              </button>
            </>
          )
        }
        {
          menu.mouth && (
            <>
              <div className="CirclePicker--overflow">
                <CirclePicker
                  color={currentColor}
                  onChangeComplete={handleChangeComplete}
                  onChange={(color) =>
                    setChanges({ ...changes, mC: color.hex.replace("#", "") })
                  }
                  colors={ArrayColors}
                />
              </div>
              <button onClick={() => setChanges({ ...changes, m: "happy01" })}>
                Mouth 1
              </button>
              <button onClick={() => setChanges({ ...changes, m: "happy02" })}>
                Mouth 2
              </button>
              <button onClick={() => setChanges({ ...changes, m: "happy03" })}>
                Mouth 3
              </button>
              <button onClick={() => setChanges({ ...changes, m: "happy04" })}>
                Mouth 4
              </button>
              <button onClick={() => setChanges({ ...changes, m: "happy05" })}>
                Mouth 5
              </button>
              <button onClick={() => setChanges({ ...changes, m: "happy06" })}>
                Mouth 6
              </button>
              <button onClick={() => setChanges({ ...changes, m: "happy07" })}>
                Mouth 7
              </button>
              <button onClick={() => setChanges({ ...changes, m: "happy08" })}>
                Mouth 8
              </button>
              <button onClick={() => setChanges({ ...changes, m: "happy09" })}>
                Mouth 9
              </button>
              <button onClick={() => setChanges({ ...changes, m: "happy10" })}>
                Mouth 10
              </button>
              <button onClick={() => setChanges({ ...changes, m: "happy11" })}>
                Mouth 11
              </button>
              <button onClick={() => setChanges({ ...changes, m: "happy12" })}>
                Mouth 12
              </button>
              <button onClick={() => setChanges({ ...changes, m: "happy13" })}>
                Mouth 13
              </button>
              <button onClick={() => setChanges({ ...changes, m: "sad01" })}>
                Mouth 14
              </button>
              <button onClick={() => setChanges({ ...changes, m: "sad02" })}>
                Mouth 15
              </button>
              <button onClick={() => setChanges({ ...changes, m: "sad03" })}>
                Mouth 16
              </button>
              <button onClick={() => setChanges({ ...changes, m: "sad04" })}>
                Mouth 17
              </button>
              <button onClick={() => setChanges({ ...changes, m: "sad05" })}>
                Mouth 18
              </button>
              <button onClick={() => setChanges({ ...changes, m: "sad06" })}>
                Mouth 19
              </button>
              <button onClick={() => setChanges({ ...changes, m: "sad07" })}>
                Mouth 20
              </button>
              <button onClick={() => setChanges({ ...changes, m: "sad08" })}>
                Mouth 21
              </button>
              <button onClick={() => setChanges({ ...changes, m: "sad09" })}>
                Mouth 22
              </button>
              <button onClick={() => setChanges({ ...changes, m: "sad10" })}>
                Mouth 23
              </button>
            </>
          )
        }
        {
          menu.eyes && (
            <>
              <div className="CirclePicker--overflow">

                <CirclePicker
                  color={currentColor}
                  onChangeComplete={handleChangeComplete}
                  onChange={(color) =>
                    setChanges({ ...changes, eC: color.hex.replace("#", "") })
                  }
                  colors={ArrayColors}
                />
              </div>
              <button onClick={() => setChanges({ ...changes, e: "variant01" })}>
                Eyes 1
              </button>
              <button onClick={() => setChanges({ ...changes, e: "variant02" })}>
                Eyes 2
              </button>
              <button onClick={() => setChanges({ ...changes, e: "variant03" })}>
                Eyes 3
              </button>
              <button onClick={() => setChanges({ ...changes, e: "variant04" })}>
                Eyes 4
              </button>
              <button onClick={() => setChanges({ ...changes, e: "variant05" })}>
                Eyes 5
              </button>
              <button onClick={() => setChanges({ ...changes, e: "variant06" })}>
                Eyes 6
              </button>
              <button onClick={() => setChanges({ ...changes, e: "variant07" })}>
                Eyes 7
              </button>
              <button onClick={() => setChanges({ ...changes, e: "variant08" })}>
                Eyes 8
              </button>
              <button onClick={() => setChanges({ ...changes, e: "variant09" })}>
                Eyes 9
              </button>
              <button onClick={() => setChanges({ ...changes, e: "variant10" })}>
                Eyes 10
              </button>
              <button onClick={() => setChanges({ ...changes, e: "variant11" })}>
                Eyes 11
              </button>
              <button onClick={() => setChanges({ ...changes, e: "variant12" })}>
                Eyes 12
              </button>
            </>
          )
        }

        <button onClick={() => setSave(save + 1)}>Save</button>
      </div >
    );
  }
  return <div className="Avatar"> </div>;
}

export default AvatarMaker;
