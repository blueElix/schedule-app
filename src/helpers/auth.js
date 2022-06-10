import cookie from "js-cookie";
import Router from "next/router";
import { getUserDetails } from "src/api";

// set in cookie
export const setCookie = (key, value) => {
  if (typeof window !== "undefined") {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

// remove from cookie
export const removeCookie = (key) => {
  if (typeof window !== "undefined") {
    cookie.remove(key);
  }
};

// get from cookie such as stored token
// will be useful when we need to make request to server with auth token
export const getCookie = (key, req) => {
  // if (typeof window !== 'undefined') {
  //     return cookie.get(key);
  // }
  return typeof window !== "undefined" ? getCookieFromBrowser(key) : getCookieFromServer(key, req);
};

export const getCookieFromBrowser = (key) => {
  return cookie.get(key);
};

export const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  // console.log('req.headers.cookie', req.headers.cookie);
  let token = req.headers.cookie.split(";").find((c) => c.trim().startsWith(`${key}=`));
  if (!token) {
    return undefined;
  }
  let tokenValue = token.split("=")[1];
  // console.log('getCookieFromServer', tokenValue);
  return tokenValue;
};

// set in localstoarge
export const setLocalStorage = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove from localstorage
export const removeLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

// authenticate user by passing data to cookie and localstorage during signin
export const authenticate = (token, cb) => {
  setCookie("token", token);
  cb();
};

// access user info from localstorage
export const isAuth = (req) => {
  if (typeof window !== "undefined") {
    const cookieChecked = getCookie("token", req);
    return cookieChecked;
  }
};

export const logout = () => {
  removeCookie("token");
  removeLocalStorage("user");
  Router.push("/login");
};

export const updateUser = (user, cb) => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("user")) {
      let auth = JSON.parse(localStorage.getItem("user"));
      auth = user;
      localStorage.setItem("user", JSON.stringify(auth));
      cb();
    }
  }
};

// gssp = get server side props
export const withAdmin = (gssp) => {
  return async (ctx) => {
    const token = getCookie("token", ctx.req);
    let user = null;

    if (token) {
      try {
        const { data: _user } = await getUserDetails(token);

        user = _user.data;
      } catch (error) {
        user = null;
        console.log(error);
      }
    }

    if (user === null || user.role !== "ADMIN") {
      // redirect

      if (typeof window === "undefined") {
        return {
          redirect: {
            permanent: false,
            destination: "/login",
          },
        };
      }
    } else {
      return gssp(ctx, { token, user });
    }

    return gssp(ctx, { token, user });
  };
};

export const withUser = (gssp) => {
  return async (ctx) => {
    const token = getCookie("token", ctx.req);
    let user = null;

    if (token) {
      try {
        const { data: _user } = await getUserDetails(token);
        user = _user.user;
      } catch (error) {
        user = null;
        console.log(error);
      }
    }
    if (user === null) {
      // redirect

      if (typeof window === "undefined") {
        return {
          redirect: {
            permanent: false,
            destination: "/login",
          },
        };
      }
    } else {
      return gssp(ctx, { token, user });
    }

    return gssp(ctx, { token, user });
  };
};
