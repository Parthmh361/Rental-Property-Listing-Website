const multer = require('multer')
const path = require('path')
const fs = require('fs')

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')

// Ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    // unique filename: timestamp-original
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_')
    cb(null, `${Date.now()}_${base}${ext}`)
  }
})

function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (allowed.includes(file.mimetype)) cb(null, true)
  else cb(new Error('Only image files are allowed'))
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }) // 5MB each

module.exports = { upload, UPLOAD_DIR }
