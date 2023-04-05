import { useEffect, useState } from "react";

function formatTime(timestamp) {
  let leftTime = (timestamp / 1000) | 0;
  let hours = parseInt(leftTime / 3600);
  leftTime = leftTime % 3600;
  let minutes = parseInt(leftTime / 60);
  let seconds = leftTime % 60;

  return `${hours}H${minutes}M${seconds}S`;
}

function CountDown(props) {
  // count: s
  const [count, setCount] = useState(parseInt(props.max / 1000));

  // 倒计时逻辑
  useEffect(() => {
    let timer;
    if (count > 0) {
      timer = window.setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    } else {
      props.finish();
    }
    return () => {
      clearTimeout(timer);
    };
  });

  // 重置计数
  useEffect(() => {
    setCount(parseInt(props.max / 1000));
  }, [props.max]);

  return <span>{formatTime(count * 1000)}</span>;
}
export default CountDown;
