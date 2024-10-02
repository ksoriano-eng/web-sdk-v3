import express from 'express'
import serveStatic from 'serve-static'
import { stringReplace } from 'string-replace-middleware'
import jwt from 'jsonwebtoken'

const port = process.env.PORT || 3000
const tenant = process.env.UJET_TENANT
const secret = process.env.UJET_COMPANY_SECRET

if (!secret || !tenant || !process.env.UJET_COMPANY_ID) {
  console.error('Please config `.env` file.')
  process.exit(1)
}

const app = express()

app.use(stringReplace({
  '$UJET_COMPANY_ID': process.env.UJET_COMPANY_ID,
  '$UJET_TENANT': tenant,
}))
app.use(serveStatic('demos'))
app.use(express.json())

app.post('/auth/token', function (req, res) {
  const payload = req.body.payload
  payload['iss'] = tenant
  const iat = parseInt(Date.now() / 1000, 10)
  payload['iat'] = iat
  payload['exp'] = iat + 600
  const token = jwt.sign(payload, secret, { algorithm: 'HS256' })
  res.json({ token })
})

app.get('/auth/custom_data', function (req, res) {
  const payload = {
    custom_data: {
      version: {
        label: 'Version',
        value: '1.0.0'
      }
    }
  }
  payload['iss'] = tenant
  const iat = parseInt(Date.now() / 1000, 10)
  payload['iat'] = iat
  payload['exp'] = iat + 600
  const token = jwt.sign(payload, secret, { algorithm: 'HS256' })
  res.json({ token })
})

app.listen(port, function () {
  console.log(`Listing at http://localhost:${port}`)
})
