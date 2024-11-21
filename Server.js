const express = require('express');
const multer = require('multer');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors());

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mb
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only image files are allowed!'));
    }
  },
});


const isPrime = (num) => {
  //checking for prime
  if (num <= 1) return false;
  for (let i = 2; i <= num/2; i++) {
    if (num % i === 0) return false;
  }
  return true;
};


app.post('/bfhl', upload.single('file'), (req, res) => {
  const { data = [] } = req.body;
  const file = req.file;

  const user_id = 'Prasanna_Samadhiya_03092002'; 
  const email = 'Prasannasamadhiya02@gmail.com';
  const roll_number = 'ABCD123'; 

  if (!Array.isArray(data)) {
    return res.status(400).json({ 
        is_success: false, 
        error: 'Invalid input data' });
  }

  const numbers = [];
  const alphabets = [];
  let highestLowercase = '';
  let primeFound = false;

  data.forEach((item) => {
    if (!isNaN(item)) {
      numbers.push(item);
      if (isPrime(Number(item))) 
        primeFound = true;
      }else if(/^[a-zA-Z]$/.test(item)) {
        alphabets.push(item);
        if (item >= 'a' && item <= 'z' && item > highestLowercase) {
           highestLowercase = item;
      }
    }
  });

  let fileValid = false;
  let fileMimeType = '';
  let fileSizeKB = 0;

  if (file) {
    fileValid = true;
    fileMimeType = file.mimetype;
    //size is divided by 1024 to Convert it into KB
    fileSizeKB = (file.size / 1024).toFixed(2); 
  }

  res.status(200).json({
    is_success: true,
    user_id,
    email,
    roll_number,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    is_prime_found: primeFound,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKB,
  });
});


app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});


app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ is_success: false, error: err.message });
  } else if (err) {
    return res.status(500).json({ is_success: false, error: err.message });
  }
  next();
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
