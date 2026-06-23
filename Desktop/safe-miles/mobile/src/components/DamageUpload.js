import { API_URL, api } from '../api/config';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Camera, Image as ImageIcon, X, Plus } from 'lucide-react-native';
import { Colors, Spacing } from '../theme/colors';

import { useAuthStore } from '../store/useAuthStore';

export default function DamageUpload({ onImagesUploaded }) {
  const { token } = useAuthStore();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const pickImage = async (useCamera = false) => {
    const permissionResult = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync() 
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", `You need to allow access to your ${useCamera ? 'camera' : 'gallery'} to upload damage images.`);
      return;
    }

    const result = useCamera 
      ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: 0.7,
        });

    if (!result.canceled) {
      const selectedImages = result.assets || [result];
      processImages(selectedImages);
    }
  };

  const processImages = async (assets) => {
    setUploading(true);
    try {
      const processed = await Promise.all(
        assets.map(async (asset) => {
          // Compress image
          const manipResult = await ImageManipulator.manipulateAsync(
            asset.uri,
            [{ resize: { width: 1000 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
          return manipResult;
        })
      );

      // Upload to backend
      const formData = new FormData();
      processed.forEach((img, index) => {
        formData.append('images', {
          uri: img.uri,
          name: `damage_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      const response = await api.post('/upload/damage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      const newUrls = response.data.urls;
      const updatedImages = [...images, ...newUrls];
      setImages(updatedImages);
      onImagesUploaded(updatedImages);
      
    } catch (error) {
      console.log('Damage image upload error:', error.message);
      Alert.alert("Upload Failed", "Could not upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url) => {
    const updated = images.filter(img => img !== url);
    setImages(updated);
    onImagesUploaded(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Attach Damage Photos (Optional)</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewScroll}>
        {images.map((url, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: url }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(url)}>
              <X color="#fff" size={12} />
            </TouchableOpacity>
          </View>
        ))}
        
        {uploading ? (
          <View style={[styles.addBtn, styles.loadingBtn]}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : (
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.addBtn} onPress={() => pickImage(true)}>
              <Camera color={Colors.textSecondary} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={() => pickImage(false)}>
              <ImageIcon color={Colors.textSecondary} size={24} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
    width: '100%',
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  previewScroll: {
    flexDirection: 'row',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  removeBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.surface,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  btnRow: {
    flexDirection: 'row',
  },
  loadingBtn: {
    borderStyle: 'solid',
  }
});
