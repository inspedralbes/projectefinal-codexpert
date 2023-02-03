import React, { useEffect, useState } from "react";
import routeFetch from "../index";

function AvatarMaker() {
  let urlStr = "";
  const [save, setSave] = useState(0);
  const [avatar, setAvatar] = useState("");

  const seed = "";

  const [bgC, backgroundColor] = useState("FFFFFF");

  const [c, clothing] = useState("variant12");
  const [cC, clothingColor] = useState("ff6f69");

  const [h, hair] = useState("short19");
  const [hC, hairColor] = useState("6E260E");

  const [sC, skinColor] = useState("ffdbac");

  const [g, glasses] = useState("dark01");
  const [gC, glassesColor] = useState("4b4b4b");
  const [gP, glassesProbability] = useState("0");

  const [a, accessories] = useState("variant01");
  const [aC, accessoriesColor] = useState("a9a9a9");
  const [aP, accessoriesProbability] = useState("0");

  const [m, mouth] = useState("happy09");
  const [mC, mouthColor] = useState("c98276");

  const [e, eyes] = useState("variant09");
  const [eC, eyesColor] = useState("5b7c8b");

  useEffect(() => {
    const fetchData = async () => {
      await fetch(routeFetch + "/index.php/getAvatar", {
        method: "POST",
        mode: 'cors',
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.url);
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
        seed +
        "&backgroundColor=" +
        bgC +
        "&clothing=" +
        c +
        "&clothingColor=" +
        cC +
        "&hair=" +
        h +
        "&hairColor=" +
        hC +
        "&skinColor=" +
        sC +
        "&glasses=" +
        g +
        "&glassesColor=" +
        gC +
        "&glassesProbability=" +
        gP +
        "&accessories=" +
        a +
        "&accessoriesColor=" +
        aC +
        "&accessoriesProbability=" +
        aP +
        "&mouth=" +
        m +
        "&mouthColor=" +
        mC +
        "&eyes=" +
        e +
        "&eyesColor=" +
        eC
      );
    }

  }, [bgC, c, cC, h, hC, sC, g, gC, gP, a, aC, aP, m, mC, e, eC]);

  function getAvatar(u) {
    const url = new URL(u);
    backgroundColor(url.searchParams.get("backgroundColor"));
    clothing(url.searchParams.get("clothing"));
    clothingColor(url.searchParams.get("clothingColor"));
    hair(url.searchParams.get("hair"));
    hairColor(url.searchParams.get("hairColor"));
    skinColor(url.searchParams.get("skinColor"));
    glasses(url.searchParams.get("glasses"));
    glassesColor(url.searchParams.get("glassesColor"));
    glassesProbability(url.searchParams.get("glassesProbability"));
    accessories(url.searchParams.get("accessories"));
    accessoriesColor(url.searchParams.get("accessoriesColor"));
    accessoriesProbability(url.searchParams.get("accessoriesProbability"));
    mouth(url.searchParams.get("mouth"));
    mouthColor(url.searchParams.get("mouthColor"));
    eyes(url.searchParams.get("eyes"));
    eyesColor(url.searchParams.get("eyesColor"));

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
    if(save > 0) {
      const sendAvatar = new FormData()
      sendAvatar.append("newAvatar", avatar);
      const fetchData = async () => {
        await fetch(routeFetch + "/index.php/setAvatar", {
          method: "POST",
          mode: 'cors',
          body: sendAvatar,
          credentials: 'include'
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          });
      };
      fetchData();
    }
  }, [save]);

  if (avatar !== "") {
    return (
      <div className="Avatar">

        <img src={avatar} alt="avatar" />
        <button onClick={() => eyes("variant01")}>Eyes 1</button>
        <button onClick={() => eyes("variant02")}>Eyes 2</button>
        <button onClick={() => eyes("variant03")}>Eyes 3</button>
        <button onClick={() => eyes("variant04")}>Eyes 4</button>
        <button onClick={() => eyes("variant05")}>Eyes 5</button>
        <button onClick={() => eyes("variant06")}>Eyes 6</button>
        <button onClick={() => eyes("variant07")}>Eyes 7</button>
        <button onClick={() => eyes("variant08")}>Eyes 8</button>
        <button onClick={() => eyes("variant09")}>Eyes 9</button>
        <button onClick={() => eyes("variant10")}>Eyes 10</button>
        <button onClick={() => eyes("variant11")}>Eyes 11</button>
        <button onClick={() => eyes("variant12")}>Eyes 12</button>
        
        <button onClick={() => setSave(save + 1)}>Save</button>
      </div>
    );
  }
  return <div className="Avatar">  </div>;
}

export default AvatarMaker;
