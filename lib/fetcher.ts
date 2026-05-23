<<<<<<< HEAD
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

=======
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

>>>>>>> 28ec0c03fa8749f0a6e22af9582120c326f74948
export default fetcher