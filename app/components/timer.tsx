import { useEffect, useState } from "react"

export function Timer({
  initialMinute = 0,
  initialSeconds = 0,
  setTimerFinished,
}: {
  initialMinute: number
  initialSeconds: number
  setTimerFinished: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [minutes, setMinutes] = useState(initialMinute)
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval)
        } else {
          setMinutes(minutes - 1)

          setSeconds(59)
        }
      }
    }, 1000)

    return () => {
      clearInterval(myInterval)
    }
  })

  useEffect(() => {
    if (minutes == 0 && seconds) {
      setTimerFinished(true)
    }
  })

  return (
    <time
      className="timer"
      aria-label="counter"
      dateTime={`${minutes}:${seconds}`}
    >
      {minutes === 0 && seconds === 0 ? null : (
        <span>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
      )}
    </time>
  )
}
