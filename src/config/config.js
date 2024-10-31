const Config = {
  baseUr_local: 'http://localhost:8000',
  baseUrl_web: '194.5.205.54',
  apiVersion: 'v1',

  // تابعی برای ساخت URL کامل با توجه به نسخه API و endpoint
  getApiUrl: (segment, endpoint, params = {}) => {
    const url = `${Config.baseUrl_web}/${segment}/${Config.apiVersion}/${endpoint}`;

    // افزودن پارامترها به URL
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${url}?${queryString}` : url;
  }
};

export default Config;
