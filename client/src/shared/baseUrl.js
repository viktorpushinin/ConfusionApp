let url = "http://localhost:3000/"

if (process.env.NODE_ENV === 'production') {
    url = "/";
}

export const baseUrl = url;