function sleep(ms) {
  return new Promise(res => setTimeout(res, ms * 1000));
}

export default sleep;
