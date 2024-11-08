const express = require('express');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Configurações do Cloudinary
cloudinary.config({
  cloud_name: 'dey57zhyo',
  api_key: '968645816526654',
  api_secret: 'QriusZeznl3YOzP909zMwn9D96g',
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para deletar imagem
app.post('/delete-image', (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    console.log('Missing public_id');
    return res.status(400).json({ error: 'Missing public_id' });
  }

  console.log('Deleting image with public_id:', public_id);

  cloudinary.uploader.destroy(public_id, (error, result) => {
    if (error) {
      console.error('Failed to delete image:', error);
      return res.status(500).json({ error: 'Failed to delete image', details: error });
    }
    console.log('Image deleted successfully:', result);
    return res.status(200).json({ message: 'Image deleted successfully', result });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
