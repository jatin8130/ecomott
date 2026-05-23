import { NextResponse as res } from "next/server"

const serverCatchError = (err: unknown, status: number = 500) => {
    if(err instanceof Error) {
        return res.json({message: err.message}, {status})
    }

    return res.json({message: "Internal server error"}, {status})
}

export default serverCatchError