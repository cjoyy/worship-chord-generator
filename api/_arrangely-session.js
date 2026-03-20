// Helper untuk login ke Arrangely dan maintain session
// Credentials HANYA dibaca dari ENV — tidak pernah dikirim ke client

const axios = require('axios');

let sessionCookie = null;
let sessionExpiry = null;

async function getArrangelySession() {
  // Cek apakah session masih valid (cache 1 jam)
  if (sessionCookie && sessionExpiry && Date.now() < sessionExpiry) {
    return sessionCookie;
  }

  // Login ke Arrangely menggunakan credentials dari ENV
  const email = process.env.ARRANGELY_EMAIL;
  const password = process.env.ARRANGELY_PASSWORD;

  if (!email || !password) {
    throw new Error('Kredensial Arrangely tidak ditemukan di environment variable');
  }

  try {
    // Fetch halaman login dulu untuk ambil CSRF token
    const loginPageRes = await axios.get('https://arrangely.io/login', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });

    // Extract CSRF token dari HTML (sesuaikan selector dengan struktur Arrangely)
    const csrfMatch = loginPageRes.data.match(/name="_token"\s+value="([^"]+)"/);
    const csrfToken = csrfMatch ? csrfMatch[1] : '';
    const cookies = loginPageRes.headers['set-cookie']?.join('; ') || '';

    // Login POST
    const loginRes = await axios.post('https://arrangely.io/login', 
      new URLSearchParams({ email, password, _token: csrfToken }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': cookies,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://arrangely.io/login'
        },
        maxRedirects: 0,
        validateStatus: (s) => s < 400
      }
    );

    // Ambil session cookie dari response
    const newCookies = loginRes.headers['set-cookie'];
    if (newCookies) {
      sessionCookie = newCookies.map(c => c.split(';')[0]).join('; ');
      sessionExpiry = Date.now() + (60 * 60 * 1000); // 1 jam
      return sessionCookie;
    }

    throw new Error('Login Arrangely gagal — cek kredensial di ENV');
  } catch (err) {
    console.error('Arrangely login error:', err.message);
    throw err;
  }
}

module.exports = { getArrangelySession };
