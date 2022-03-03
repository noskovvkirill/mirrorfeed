import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

const ironOptions = {
    cookieName: 'siwe',
    password: process.env.SUPABASE_JWT_SECRET as string,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    switch (method) {
        case 'GET':
            req.session.destroy()
            res.send({ ok: true })
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

export default withIronSessionApiRoute(handler, ironOptions)