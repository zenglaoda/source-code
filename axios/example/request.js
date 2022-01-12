import Axios from 'axios';

// 串行: 请求顺序执行
// 并行: 限制统一时间请求发出数
// 中断请求

const axios = new Axios({
    timeout: 15 * 1000,
    timeoutErrorMessage: '请求超时'
});

export function interceptResponseSuccess(response) {
    return response.data;
}

export function interceptResponseFail(error) {
    function handleAxiosError(axiosError) {
        // onabort
        if (axiosError.code === 'ECONNABORTED') {
            console.log(`请求中断: ${axiosError.message}`);
            return Promise.reject(axiosError);
        }

        // ontimeout
        if (axiosError.code === 'ETIMEDOUT' || axiosError.code === 'ECONNABORTED') {
            console.log(`请求超时: ${axiosError.message}`);
            return Promise.reject(axiosError);
        }

        // 请求有响应但请求状态码并非预期值
        if (axiosError.response) {
            if (String(axiosError.response.status) === 400) {
                // 请求参数错误
            }
            return Promise.reject(axiosError);
        }

        // 请求无响应或报错 404/500
        console.log(axiosError.toJSON());
        return Promise.reject(axiosError);
    }

    // axios 正常执行
    if (Axios.isAxiosError(error)) {
        return handleAxiosError(error);
    } else {
        // axios 请求之外抛出的错误，如代码错误，数据类型转换错误
        console.log(error);
    }

    return Promise.reject(error);
}


/**
 * @description get 请求
 * @param {string} url 
 * @returns {function}
 */
export function GET(url) {
    return function(params) {
        const config = {
            url,
            params
        };
        return axios(config);
    }
}
  
/**
 * @description post 请求
 * @param {string} url 
 * @returns {function}
 */
export function POST(url) {
    return function(data) {
        const config = {
            url,
            method: 'post',
            data
        };
        return axios(config);
    }
}


export function createRequest(config) {
    function request(config, body) {

    }

    request.cancel = function() {

    }
    
}

axios.intercepr.response.use(interceptResponseSuccess, interceptResponseFail);