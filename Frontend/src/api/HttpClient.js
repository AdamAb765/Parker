import axios from "axios";

const SERVER_IP = "http://193.106.55.134";
//const SERVER_IP = "http://10.0.0.14";
const SERVER_PORT = "3000";
const REQUEST_SUCESS_STATUS = 200;

export const get_url = () => `${SERVER_IP}:${SERVER_PORT}`

export const get = async (route) => {
  let result;
  const url = `${SERVER_IP}:${SERVER_PORT}/${route}`;

  const res = await axios.get(url);

  if (res.status === REQUEST_SUCESS_STATUS) {
    result = res.data;
  }

  return result;
};

export const post = async (route, body, headers={"Content-Type": "application/json"}) => {
  let result;
  const url = `${SERVER_IP}:${SERVER_PORT}/${route}`;

  const res = await axios.post(url, body, {
    headers: headers
  });

  if (res.status === REQUEST_SUCESS_STATUS) {
    result = res.data;
  }

  return result;
};

export const put = async (route, body, headers={"Content-Type": "application/json"}) => {
  let result;
  const url = `${SERVER_IP}:${SERVER_PORT}/${route}`;

  const res = await axios.put(url, body, {
    headers: headers
  });

  if (res.status === REQUEST_SUCESS_STATUS) {
    result = res.data;
  }

  return result;
};

export const remove = async (route, body) => {
  let result;
  const url = `${SERVER_IP}:${SERVER_PORT}/${route}`;

  const res = await axios.delete(url, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === REQUEST_SUCESS_STATUS) {
    result = res.data;
  }

  return result;
};
