import axios from 'axios';

const baseurl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: `${baseurl}`, 
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access_token'); // Fetch the access token from localStorage
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`; // Include it in the request header
        }
        return config; // Return the modified config
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 

            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await axiosInstance.post('/api/token/refresh/', {
                        refresh: refreshToken,
                    });

                    localStorage.setItem('access_token', response.data.access);
                    originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access;
                    return axiosInstance(originalRequest);
                } catch (err) {
                    console.error('Token refresh failed:', err);
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
