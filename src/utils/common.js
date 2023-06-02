const sleepy = (msec) =>
  new Promise((resolve, _) => {
    setTimeout(resolve, msec);
  });

export default {
    sleepy,
}