import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body
  console.log(data)
  res.redirect(200, `.`)
}
