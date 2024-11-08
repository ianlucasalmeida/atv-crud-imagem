import React, { useState } from 'react';
import { View, Button, Image, ActivityIndicator, Alert, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const CloudinaryUpload = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const CLOUD_NAME = "dey57zhyo";
  const UPLOAD_PRESET = "storage";
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri });
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Please select an image first");
      return;
    }

    setUploading(true);

    const data = new FormData();
    data.append('file', {
      uri: image.uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    data.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadedImages([...uploadedImages, { uri: response.data.secure_url, public_id: response.data.public_id }]);
      setImage(null);
      Alert.alert("Image uploaded successfully!");

    } catch (error) {
      console.error(error);
      Alert.alert("Upload failed, please try again.");
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (public_id) => {
    try {
      console.log('Deleting image with public_id:', public_id);
      const response = await axios.post('http://SEU_ENDERECO_IP:3000/delete-image', { public_id });

      if (response.status === 200) {
        setUploadedImages(uploadedImages.filter(image => image.public_id !== public_id));
        Alert.alert("Image deleted successfully!");
      } else {
        Alert.alert("Failed to delete image, please try again.");
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Delete failed, please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={uploadImage} disabled={uploading}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>
      {uploading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
      {uploadedImages.length > 0 && (
        <View style={{ marginTop: 20, width: '100%' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Uploaded Images:</Text>
          <FlatList
            data={uploadedImages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.uri }} style={styles.thumbnail} />
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(item.public_id)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CloudinaryUpload;
