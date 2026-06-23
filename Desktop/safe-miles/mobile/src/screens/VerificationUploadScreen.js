import { api } from '../api/config';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Typography } from '../theme/colors';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react-native';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

export default function VerificationUploadScreen({ navigation }) {
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState({
    license: null,
    medical: null,
    alcohol: null,
    business: null,
  });

  const handleUpload = async () => {
    if (loading) return;
    
    if (user.role === 'DRIVER' && (!docs.license || !docs.medical || !docs.alcohol)) {
      Alert.alert('Incomplete', 'Please upload all driver documents.');
      return;
    }

    setLoading(true);
    console.log("Submitting...");

    try {
      const endpoint = user.role === 'DRIVER' ? '/verification/driver' : '/verification/mechanic';
      const payload = user.role === 'DRIVER' ? {
        licenseNumber: 'DL-' + Math.random().toString(36).substring(7).toUpperCase(),
        licenseUrl: 'https://cdn.safemiles.com/license.jpg',
        medicalCertUrl: 'https://cdn.safemiles.com/medical.jpg',
        alcoholRecordUrl: 'https://cdn.safemiles.com/alcohol.jpg',
      } : {
        shopName: 'Fast Fix Auto',
        businessAddress: '123 Tech Park, Pune',
        businessProofUrl: 'https://cdn.safemiles.com/business.jpg',
        specialization: ['Engine', 'Tires'],
      };

      const response = await api.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response:", response?.data);

      if (response?.status === 200 || response?.status === 201) {
        Alert.alert('Success', 'Documents submitted for verification.', [
          { text: 'OK', onPress: () => {
              if (user.role === 'MECHANIC') {
                navigation.navigate('MechanicDashboard');
              } else if (user.role === 'DRIVER') {
                navigation.navigate('DriverDashboard');
              } else {
                navigation.navigate('Dashboard');
              }
            } 
          }
        ]);
      }
    } catch (error) {
      console.log("Submit error:", error);
      Alert.alert("Error", "Please try again");
    } finally {
      setLoading(false);
    }
  };

  const renderUploadBox = (title, key, icon) => (
    <TouchableOpacity 
      style={[styles.uploadBox, docs[key] && styles.uploadBoxDone]} 
      onPress={() => setDocs({...docs, [key]: true})}
    >
      {icon}
      <Text style={styles.uploadTitle}>{title}</Text>
      {docs[key] ? (
        <CheckCircle color={Colors.success} size={20} />
      ) : (
        <Upload color={Colors.textSecondary} size={20} />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return <Loader fullScreen message="Submitting documents..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Account Verification</Text>
      <Text style={styles.subtitle}>Please upload the required documents to activate your account.</Text>

      <View style={styles.section}>
        {user.role === 'DRIVER' ? (
          <>
            {renderUploadBox('Driving License', 'license', <FileText color={Colors.secondary} />)}
            {renderUploadBox('Medical Certificate', 'medical', <FileText color={Colors.secondary} />)}
            {renderUploadBox('Alcohol Test Record', 'alcohol', <FileText color={Colors.secondary} />)}
          </>
        ) : (
          <>
            {renderUploadBox('Business Proof', 'business', <FileText color={Colors.secondary} />)}
          </>
        )}
      </View>

      <View style={styles.infoBox}>
        <AlertCircle color={Colors.warning} size={20} />
        <Text style={styles.infoText}>Verification typically takes 24-48 hours. You will be notified once approved.</Text>
      </View>

      <Button onPress={handleUpload} title="Submit for Review" style={styles.button} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginTop: Spacing.xl,
  },
  subtitle: {
    ...Typography.caption,
    marginVertical: Spacing.md,
  },
  section: {
    marginTop: Spacing.lg,
  },
  uploadBox: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  uploadBoxDone: {
    borderColor: Colors.success,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  uploadTitle: {
    flex: 1,
    color: Colors.text,
    marginLeft: Spacing.md,
    fontSize: 16,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.xl,
  },
  infoText: {
    flex: 1,
    color: Colors.text,
    fontSize: 12,
    marginLeft: Spacing.sm,
    lineHeight: 18,
  },
  button: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
