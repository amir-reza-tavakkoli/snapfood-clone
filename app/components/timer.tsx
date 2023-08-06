import { useEffect, useState } from "react"

type TimerProps = {
  initialMinute: number
  initialSeconds: number
  setTimerFinished?: React.Dispatch<React.SetStateAction<boolean>>
}

export function Timer({
  initialMinute = 0,
  initialSeconds = 0,
  setTimerFinished,
}: TimerProps) {
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
    if (minutes === 0 && seconds && setTimerFinished) {
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
          <span> شکیبا باشید </span>
          {minutes.toLocaleString("fa")}:
          {seconds < 10
            ? "  " + `۰${seconds.toLocaleString("fa")}`
            : seconds.toLocaleString("fa")}
        </span>
      )}
    </time>
  )
}
