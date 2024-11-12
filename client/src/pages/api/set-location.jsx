// pages/api/set-location.js

import { parse } from 'cookie';
import Cookies from 'cookies';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { latitude, longitude } = req.body;

    if (latitude && longitude) {
      const cookies = new Cookies(req, res);
      cookies.set('location', JSON.stringify({ latitude, longitude }), {
        httpOnly: true,
        expires: new Date(Date.now() + 86400000), // Cookie expires in 1 day
      });

      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: 'Latitude and longitude are required.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
