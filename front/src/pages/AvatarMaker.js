import React, { useEffect, useState } from 'react'
import routes from '../conn_routes'
import '../styles/avatarMaker.css'
import { useNavigate } from 'react-router-dom' // Rutas
import Cookies from 'universal-cookie'
import Background from '../components/AvatarMaker/Background'
import Cloth from '../components/AvatarMaker/Cloth'
import Hair from '../components/AvatarMaker/Hair'
import SkinColor from '../components/AvatarMaker/SkinColor'
import Glasses from '../components/AvatarMaker/Glasses'
import Accessories from '../components/AvatarMaker/Accessories'
import Mouth from '../components/AvatarMaker/Mouth'
import Eyes from '../components/AvatarMaker/Eyes'

function AvatarMaker() {
  const cookies = new Cookies()
  const navigate = useNavigate()
  const [optionCopy, setOptionCopy] = useState('background')
  const [save, setSave] = useState(0)
  const [avatar, setAvatar] = useState('')

  const [menu, setMenu] = useState({
    background: true,
    cloth: false,
    hair: false,
    skinColor: false,
    glasses: false,
    accessories: false,
    mouth: false,
    eyes: false
  })

  const [changes, setChanges] = useState({
    seed: '',
    bg: 'FFFFFF',
    c: 'variant12',
    cC: 'ff6f69',
    h: 'short19',
    hC: 'ffdbac',
    sC: 'ffdbac',
    g: 'dark01',
    gC: '4b4b4b',
    gP: '0',
    a: 'variant01',
    aC: 'a9a9a9',
    aP: '0',
    m: 'happy09',
    mC: 'c98276',
    e: 'variant09',
    eC: '5b7c8b'
  })

  // COLOR PICKER
  const [currentColor, setCurrentColor] = useState('#ffffff')

  const handleChangeComplete = (color) => {
    setCurrentColor(color.hex)
  }

  const ArrayColors = ['#000000', '#2D2D2D', '#595858', '#969696', '#C1C1C1', '#F1F1F1', '#41240B', '#6C3F18', '#8B5B30', '#AE7A4C', '#CC9D74', '#E9C2A0', '#eb8d02', '#FFC107', '#FFEB3B', '#FFF06F', '#FFF176', '#FFF8B7', '#E65100', '#FB6310', '#F57C00', '#FF9800', '#FFB74D', '#FFE0B2', '#FF0000', '#FC3030', '#FF5959', '#FD7B7B', '#FE9C9C', '#FEBDBD', '#FD0082', '#FE339C', '#FE52AB', '#FB89C4', '#FCA3D1', '#FFBEDF', '#C700ff', '#D235FE', '#D957FE', '#E27CFF', '#E797FD', '#EEB1FF', '#8500FF', '#9D32FF', '#A747FF', '#B466FC', '#C98DFF', '#DEBAFF', '#0200FF', '#2B29FE', '#4D4BFC', '#6362FE', '#7978FD', '#9897FE', '#00ABFF', '#30BBFF', '#53C7FF', '#71D0FF', '#96DBFD', '#BDE8FD', '#00FFA6', '#31FEB6', '#56FDC3', '#8CFFD7', '#A5FEDF', '#C7FEEB', '#00FF28', '#2CFD4D', '#4FFB6A', '#74FB89', '#93FBA3', '#B0FBBC', '#33691E', '#689F38', '#77B541', '#8BC34A', '#AED581', '#DCEDC8', '#827717', '#968A1C', '#AFB42B', '#C5CA38', '#CDDC39', '#DCE775', '#5B4202', '#846205', '#AF8003', '#C89A1D', '#DAAD34', '#EAC050']

  useEffect(() => {
    const fetchData = async () => {
      const token = new FormData()
      token.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
      await fetch(routes.fetchLaravel + 'getAvatar', {
        method: 'POST',
        mode: 'cors',
        body: token,
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.url != null) {
            getAvatar(data.url)
          } else {
            navigate('/login')
          }
        })
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (avatar !== '') {
      setAvatar(
        'https://api.dicebear.com/5.x/pixel-art/svg?seed=' +
        changes.seed +
        '&backgroundColor=' +
        changes.bg +
        '&clothing=' +
        changes.c +
        '&clothingColor=' +
        changes.cC +
        '&hair=' +
        changes.h +
        '&hairColor=' +
        changes.hC +
        '&skinColor=' +
        changes.sC +
        '&glasses=' +
        changes.g +
        '&glassesColor=' +
        changes.gC +
        '&glassesProbability=' +
        changes.gP +
        '&accessories=' +
        changes.a +
        '&accessoriesColor=' +
        changes.aC +
        '&accessoriesProbability=' +
        changes.aP +
        '&mouth=' +
        changes.m +
        '&mouthColor=' +
        changes.mC +
        '&eyes=' +
        changes.e +
        '&eyesColor=' +
        changes.eC
      )
    }
  }, [changes])

  function changeOption(option) {
    if (option !== optionCopy) {
      setOptionCopy(option)
      const menuCopy = { ...menu }
      const changeOption = !menuCopy[option]
      Object.keys(menuCopy).forEach((key) => (menuCopy[key] = false))
      menuCopy[option] = changeOption
      setMenu(menuCopy)
    }
  }

  function getAvatar(u) {
    const url = new URL(u)
    setChanges({
      ...changes,
      bg: url.searchParams.get('backgroundColor'),
      c: url.searchParams.get('clothing'),
      cC: url.searchParams.get('clothingColor'),
      h: url.searchParams.get('hair'),
      hC: url.searchParams.get('hairColor'),
      sC: url.searchParams.get('skinColor'),
      g: url.searchParams.get('glasses'),
      gC: url.searchParams.get('glassesColor'),
      gP: url.searchParams.get('glassesProbability'),
      a: url.searchParams.get('accessories'),
      aC: url.searchParams.get('accessoriesColor'),
      aP: url.searchParams.get('accessoriesProbability'),
      m: url.searchParams.get('mouth'),
      mC: url.searchParams.get('mouthColor'),
      e: url.searchParams.get('eyes'),
      eC: url.searchParams.get('eyesColor')
    })

    setAvatar(
      'https://api.dicebear.com/5.x/pixel-art/svg?seed=' +
      '' +
      '&backgroundColor=' +
      url.searchParams.get('backgroundColor') +
      '&clothing=' +
      url.searchParams.get('clothing') +
      '&clothingColor=' +
      url.searchParams.get('clothingColor') +
      '&hair=' +
      url.searchParams.get('hair') +
      '&hairColor=' +
      url.searchParams.get('hairColor') +
      '&skinColor=' +
      url.searchParams.get('skinColor') +
      '&glasses=' +
      url.searchParams.get('glasses') +
      '&glassesColor=' +
      url.searchParams.get('glassesColor') +
      '&glassesProbability=' +
      url.searchParams.get('glassesProbability') +
      '&accessories=' +
      url.searchParams.get('accessories') +
      '&accessoriesColor=' +
      url.searchParams.get('accessoriesColor') +
      '&accessoriesProbability=' +
      url.searchParams.get('accessoriesProbability') +
      '&mouth=' +
      url.searchParams.get('mouth') +
      '&mouthColor=' +
      url.searchParams.get('mouthColor') +
      '&eyes=' +
      url.searchParams.get('eyes') +
      '&eyesColor=' +
      url.searchParams.get('eyesColor')
    )
  }

  useEffect(() => {
    if (save > 0) {
      const sendAvatar = new FormData()
      sendAvatar.append('newAvatar', avatar)
      sendAvatar.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
      const fetchData = async () => {
        await fetch(routes.fetchLaravel + 'setAvatar', {
          method: 'POST',
          mode: 'cors',
          body: sendAvatar,
          credentials: 'include'
        })
          .then((response) => response.json())
          .then((data) => {
            if (cookies.get('token') !== undefined) {
              window.postMessage({
                type: 'send_token-emit',
                token: cookies.get('token')
              }, '*')
            }
          })
      }
      fetchData()
      navigate('/lobbies')
    }
  }, [save])

  if (avatar !== '') {
    return (
      <div className='Avatar'>
        <div className='avatar__left'>
          <img className='avatar__img' src={avatar} alt='avatar' />
          <br />
          <button className='avatar__menu-btn' onClick={() => setSave(save + 1)}>Save</button>

        </div>
        <div className='avatar__right'>

          <div className='avatar__menu'>
            <button className='avatar__menu-btn' onClick={() => changeOption('background')}>Background</button>
            <button className='avatar__menu-btn' onClick={() => changeOption('cloth')}>Cloth</button>
            <button className='avatar__menu-btn' onClick={() => changeOption('hair')}>Hair</button>
            <button className='avatar__menu-btn' onClick={() => changeOption('skinColor')}>Skin Color</button>
            <button className='avatar__menu-btn' onClick={() => changeOption('glasses')}>Glasses</button>
            <button className='avatar__menu-btn' onClick={() => changeOption('accessories')}>Accessories</button>
            <button className='avatar__menu-btn' onClick={() => changeOption('mouth')}>Mouth</button>
            <button className='avatar__menu-btn' onClick={() => changeOption('eyes')}>Eyes</button>
          </div>
          {menu.background && (
            <Background currentColor={currentColor} handleChangeComplete={handleChangeComplete} setChanges={setChanges} ArrayColors={ArrayColors} changes={changes} />
          )}
          {menu.cloth && (
            <Cloth currentColor={currentColor} handleChangeComplete={handleChangeComplete} setChanges={setChanges} ArrayColors={ArrayColors} changes={changes} />
          )
          }
          {
            menu.hair && (
              <Hair currentColor={currentColor} handleChangeComplete={handleChangeComplete} setChanges={setChanges} ArrayColors={ArrayColors} changes={changes} />
            )
          }
          {
            menu.skinColor && (
              <SkinColor currentColor={currentColor} handleChangeComplete={handleChangeComplete} setChanges={setChanges} ArrayColors={ArrayColors} changes={changes} />
            )
          }
          {
            menu.glasses && (
              <Glasses currentColor={currentColor} handleChangeComplete={handleChangeComplete} setChanges={setChanges} ArrayColors={ArrayColors} changes={changes} />
            )
          }
          {
            menu.accessories && (
              <Accessories currentColor={currentColor} handleChangeComplete={handleChangeComplete} setChanges={setChanges} ArrayColors={ArrayColors} changes={changes} />
            )
          }
          {
            menu.mouth && (
              <Mouth currentColor={currentColor} handleChangeComplete={handleChangeComplete} setChanges={setChanges} ArrayColors={ArrayColors} changes={changes} />
            )
          }
          {
            menu.eyes && (
              <Eyes currentColor={currentColor} handleChangeComplete={handleChangeComplete} setChanges={setChanges} ArrayColors={ArrayColors} changes={changes} />
            )
          }
        </div >

      </div >
    )
  }
  return <div className='Avatar'> </div>
}

export default AvatarMaker
