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

/**
 * Pagina para crear o editar tu avatar.
 * @function AvatarMaker
 */
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

  const ArrayColors = ['#700002', '#BD0206', '#FC0207', '#FF474B', '#FC6D70', '#FF9496'/**/, '#750052', '#B50380', '#F903B0', '#FE49C8', '#FE7FD8', '#FCABE4'/**/, '#3D0075', '#5F00B6', '#890BFC', '#A443FC', '#BA70FD', '#D4A6FE'/**/, '#0E006B', '#1901BC', '#381FE1', '#4429FC', '#705BFD', '#AA9DFF'/**/, '#02397F', '#0353BA', '#1972E6', '#3189FC', '#60A5FD', '#8FC0FF', /**/ '#007365', '#03A895', '#07DFC6', '#2EE7D1', '#4EE3D2', '#78EFE1'/**/, '#097101', '#0E9F02', '#18CA0A', '#37E429', '#61E157', '#91F189'/**/, '#6E6C03', '#9C9A00', '#CECB08', '#F2EF16', '#F2F050', '#FCFA89'/***/, '#594501', '#8D6E01', '#C49802', '#FBC302', '#FCD346', '#FBE28C'/** */, '#6C3B06', '#AF5D04', '#E17602', '#FF8603', '#FCA343', '#FAC080'/** */, '#4C1500', '#962A01', '#CC3B05', '#F64401', '#FE7542', '#FD9973'/** */, '#000000', '#D9D8D7']

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

  /**
 * Cambia de opción entre los botones de arriba para mostrar el apartado que tenga que mostrar.
 * @function changeOption
 */
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

  /**
 * Funcion para recoger el avatar de la API DiceBear.
 * @function getAvatar
 */
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
      if (localStorage.getItem('lastPage') !== null) {
        navigate('/profile')
      } else {
        navigate('/codeworld')
      }
    }
  }, [save])

  if (avatar !== '') {
    return (
      <div className='Avatar'>

        <div className='avatar__left'>

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
        <div className='avatar__right'>
          <h1 className='noElement'>YOUR AVATAR:</h1>
          <br />
          <img className='avatar__img' src={avatar} alt='avatar' />
          <br />
          <div className='avatar__Buttons--flex'>
            <button className='avatar__Button close' onClick={() => setSave(save + 1)}>Cancel</button>
            <button className='avatar__Button' onClick={() => setSave(save + 1)}>Save</button>
          </div>
        </div>

      </div >
    )
  }
  return <div className='Avatar'> </div>
}

export default AvatarMaker
