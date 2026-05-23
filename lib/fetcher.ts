import axios, { isAxiosError } from "axios"

const fetcher = async (url: string) => {
    try {
        const {data} = await axios.get(url)
        return data
        
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.message)
        }

        if(error instanceof Error) {
            throw new Error(error.message)
        }
    }
}

export default fetcher