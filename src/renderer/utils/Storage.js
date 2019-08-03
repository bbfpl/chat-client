const curTime = new Date().getTime();

function isJsonStr(str) {
  try {
    let obj = JSON.parse(str);
    if (typeof obj === "object" && obj) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

export default {
  set(key, val) {
    if (typeof val === "object") {
      val = JSON.stringify(val);
    }
    window.localStorage.setItem(key, val);
  },
  get(key) {
    let val = window.localStorage.getItem(key);
    if (val) {
      if (isJsonStr(val)) {
        return JSON.parse(val);
      } else {
        return val;
      }
    } else return null;
  },
  remove(key) {
    window.localStorage.removeItem(key);
    window.localStorage.removeItem(`expire_in_${key}`);
  },
  setExpireIn(key, val) {
    // val为毫秒
    let expireTime = curTime + val;
    window.localStorage.setItem(`expire_in_${key}`, expireTime);
  },
  getUnExpiredVal(key) {
    let val = window.localStorage.getItem(key);
    if (val) {
      val = isJsonStr(val) ? JSON.parse(val) : val || "";
    }
    let keyExpireIn = window.localStorage.getItem(`expire_in_${key}`);
    if (val && keyExpireIn && keyExpireIn > curTime) {
      return val;
    } else {
      return false;
    }
  }
};
