import '../assets/player.css'
import music from '../assets/sounds/test.mp3'
import pauseIcon from '../assets/icons/pause.svg'
import playIcon from '../assets/icons/play.svg'
import nextIcon from '../assets/icons/next.svg'
import prevIcon from '../assets/icons/prev.svg'
import { useEffect, useState } from 'react'
import picture from '../assets/picture/images.jpg'
import useSound from 'use-sound'
const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [time, setTime] = useState({
    min: '',
    sec: ''
  })
  const [currTime, setCurrTime] = useState({
    min: '',
    sec: ''
  })
  const [seconds, setSeconds] = useState()
  const [play, { pause, duration, sound }] = useSound(music)
  useEffect(() => {
    if (duration) {
      const sec = duration / 1000
      const min = Math.floor(sec / 60)
      const secRemain = Math.floor(sec % 60)
      setTime({
        min: min,
        sec: secRemain
      })
    }
  }, [isPlaying])
  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek([]))
        const min = Math.floor(sound.seek([]) / 60)
        const sec = Math.floor(sound.seek([]) % 60)
        setCurrTime({
          min,
          sec
        })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [sound])
  const playingButton = () => {
    if (isPlaying) {
      pause()
      setIsPlaying(false)
    } else {
      play()
      setIsPlaying(true)
    }
  }
  return (
    <div className="player">
      <div className="player__box"></div>
      <div className="player__cd">
        <img width={200} height={200} src={picture} alt="" />
      </div>
      <div className="player__play">
        <div className="player__btn">
          <button>
            <img width={20} height={20} src={prevIcon} alt="" />
          </button>
          <button onClick={playingButton}>
            <img width={20} height={20} src={isPlaying ? pauseIcon : playIcon} alt="" />
          </button>
          <button>
            <img width={20} height={20} src={nextIcon} alt="" />
          </button>
        </div>
        <div className="player__time">
          <p>
            {String(currTime.min).padStart(2, '0')}:{String(currTime.sec).padStart(2, '0')}
          </p>
          <p>
            {String(time.min).padStart(2, '0')}:{String(time.sec).padStart(2, '0')}
          </p>
        </div>
        <input
          type="range"
          min="0"
          max={duration / 1000}
          default="0"
          value={seconds}
          className="timeline"
          onChange={(e) => {
            sound.seek([e.target.value])
          }}
        />
      </div>
    </div>
  )
}

export default Player
