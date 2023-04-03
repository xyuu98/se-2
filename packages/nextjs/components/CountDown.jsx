import { useEffect, useState } from "react";

function CountDown(props) {
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

  return <span>{count}</span>;
}
export default CountDown;
