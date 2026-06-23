import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Upload, CheckCircle } from 'lucide-react-native';

export default function DamageUploadScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleUpload = () => {
    if (!image) return Alert.alert('Error', 'Please select an image first.');
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      Alert.alert('Success', 'Damage report uploaded successfully! (Mock)', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Report Damage</Text>
      <Text style={styles.subtitle}>Upload photos of the incident</Text>

      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Camera color={Colors.textSecondary} size={48} />
            <Text style={styles.placeholderText}>No image selected</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Camera color="#FFF" size={20} />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Upload color="#FFF" size={20} />
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.submitBtn, (!image || uploading) && styles.disabledBtn]} 
        onPress={handleUpload}
        disabled={!image || uploading}
      >
        <Text style={styles.submitText}>{uploading ? 'Uploading...' : 'Submit Report'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.md },
  title: { ...Typography.h1, color: Colors.primary },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.xl },
  imageContainer: { height: 300, backgroundColor: Colors.surface, borderRadius: 12, overflow: 'hidden', marginBottom: Spacing.lg },
  preview: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: Colors.textSecondary, marginTop: Spacing.sm },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl },
  button: { flex: 0.48, backgroundColor: Colors.secondary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: Spacing.md, borderRadius: 8 },
  buttonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },
  submitBtn: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 8, alignItems: 'center' },
  disabledBtn: { opacity: 0.5 },
  submitText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
