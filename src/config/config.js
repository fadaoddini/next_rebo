const Config = {
  baseUrl: "https://app.rebo.ir",
  apiVersion: "v1",

  getApiUrl: (segment, endpoint, params = {}) => {
    const url = `${Config.baseUrl}/${segment}/${Config.apiVersion}/${endpoint}`;

    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${url}?${queryString}` : url;
  },
};

export default Config;
