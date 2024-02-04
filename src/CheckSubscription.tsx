export function CheckSubscription(
  pUserId: string,
  pSubEnd: number,
  pCallBack: (_v: boolean) => void
) {
  const TimeInSecond: number = Math.floor(Date.now() / 1000);
  if (pSubEnd !== undefined && pSubEnd !== 0 && pSubEnd > TimeInSecond) {
    pCallBack(true);
  } else {
    //Call API to recheck subscription status
    console.log("Checking subscription");
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/pay/subscription/${pUserId}`
    ).then((res: any) => {
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      res.json().then((data: any) => {
        if (
          data.sub_end !== undefined &&
          data.sub_end !== 0 &&
          data.sub_end > TimeInSecond
        ) {
          pCallBack(true);
        }
      });
    });
  }
}
