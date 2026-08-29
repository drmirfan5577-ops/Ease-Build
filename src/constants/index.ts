export const APP_NAME = "eSmart World App Builder";
export const APP_TAGLINE = "Build Android & React Native Apps Visually";
export const APP_URL = "https://esmartworld.onspace.app/drirfan";
export const APP_VERSION = "1.0.0";
export const AUTHOR = "Dr. Irfan";
export const COMPANY = "eSmart World";
export const COMPANY_EMAIL = "drirfan@esmartworld.com";
export const COMPANY_WEBSITE = "https://esmartworld.onspace.app/drirfan";
export const COPYRIGHT_YEAR = "2024–2026";

// Admin credentials
export const ADMIN_PASSWORD = "Daaod5577";
export const ADMIN_EMAIL = "admin@esmartworld.com";

// GitHub / Expo deployment links
export const GITHUB_REPO_URL = "https://github.com/esmartworld/drirfan-app-builder";
export const EXPO_GO_URL = "https://expo.dev/@esmartworld/drirfan-app-builder";
export const EXPO_QR_URL = "https://qr.expo.dev/eas-update?projectId=esmartworld-drirfan";
export const APK_DOWNLOAD_URL = "https://esmartworld.onspace.app/drirfan/releases/latest/app-release.apk";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.esmartworld.appbuilder";
export const SOURCE_CODE_URL = "https://github.com/esmartworld/drirfan-app-builder/archive/refs/heads/main.zip";
export const BACKUP_URL = "https://esmartworld.onspace.app/drirfan/backups/complete-setup.zip";
export const DOCS_URL = "https://esmartworld.onspace.app/drirfan/docs";

export const ANDROID_COMPONENTS = [
  { type: 'Button', label: 'Button', icon: '⬜', category: 'Basic' },
  { type: 'TextView', label: 'Text View', icon: '𝐓', category: 'Basic' },
  { type: 'EditText', label: 'Edit Text', icon: '✏️', category: 'Basic' },
  { type: 'ImageView', label: 'Image View', icon: '🖼️', category: 'Basic' },
  { type: 'CheckBox', label: 'CheckBox', icon: '☑️', category: 'Basic' },
  { type: 'RadioButton', label: 'Radio Button', icon: '🔘', category: 'Basic' },
  { type: 'Switch', label: 'Switch', icon: '🔀', category: 'Basic' },
  { type: 'SeekBar', label: 'Seek Bar', icon: '🎚️', category: 'Basic' },
  { type: 'ProgressBar', label: 'Progress Bar', icon: '⏳', category: 'Basic' },
  { type: 'Spinner', label: 'Spinner', icon: '🔽', category: 'Basic' },
  { type: 'LinearLayout', label: 'Linear Layout', icon: '▤', category: 'Layouts' },
  { type: 'RelativeLayout', label: 'Relative Layout', icon: '▥', category: 'Layouts' },
  { type: 'ConstraintLayout', label: 'Constraint Layout', icon: '⊞', category: 'Layouts' },
  { type: 'ScrollView', label: 'Scroll View', icon: '↕️', category: 'Layouts' },
  { type: 'CardView', label: 'Card View', icon: '🃏', category: 'Material' },
  { type: 'Toolbar', label: 'Toolbar', icon: '━', category: 'Material' },
  { type: 'BottomNavigation', label: 'Bottom Nav', icon: '🔲', category: 'Material' },
  { type: 'FloatingActionButton', label: 'FAB', icon: '➕', category: 'Material' },
  { type: 'RecyclerView', label: 'RecyclerView', icon: '📋', category: 'Advanced' },
  { type: 'ListView', label: 'List View', icon: '📄', category: 'Advanced' },
  { type: 'WebView', label: 'Web View', icon: '🌐', category: 'Advanced' },
  { type: 'MapView', label: 'Map View', icon: '🗺️', category: 'Advanced' },
  { type: 'VideoView', label: 'Video View', icon: '🎬', category: 'Advanced' },
];

export const REACT_NATIVE_COMPONENTS = [
  { type: 'View', label: 'View', icon: '▢', category: 'Core' },
  { type: 'Text', label: 'Text', icon: '𝐓', category: 'Core' },
  { type: 'TextInput', label: 'TextInput', icon: '✏️', category: 'Core' },
  { type: 'Image', label: 'Image', icon: '🖼️', category: 'Core' },
  { type: 'ScrollView', label: 'ScrollView', icon: '↕️', category: 'Core' },
  { type: 'FlatList', label: 'FlatList', icon: '📋', category: 'Core' },
  { type: 'TouchableOpacity', label: 'Touchable', icon: '👆', category: 'Core' },
  { type: 'Pressable', label: 'Pressable', icon: '🖱️', category: 'Core' },
  { type: 'Switch', label: 'Switch', icon: '🔀', category: 'Core' },
  { type: 'ActivityIndicator', label: 'Loader', icon: '⟳', category: 'Core' },
  { type: 'StatusBar', label: 'StatusBar', icon: '📶', category: 'Core' },
  { type: 'SafeAreaView', label: 'SafeArea', icon: '🛡️', category: 'Core' },
  { type: 'Modal', label: 'Modal', icon: '🪟', category: 'Overlay' },
  { type: 'Alert', label: 'Alert', icon: '⚠️', category: 'Overlay' },
  { type: 'KeyboardAvoidingView', label: 'Keyboard', icon: '⌨️', category: 'Advanced' },
  { type: 'WebView', label: 'WebView', icon: '🌐', category: 'Advanced' },
  { type: 'Camera', label: 'Camera', icon: '📷', category: 'Advanced' },
  { type: 'MapView', label: 'MapView', icon: '🗺️', category: 'Advanced' },
];

export const CODE_TEMPLATES = {
  kotlin: `package com.esmartworld.myapp

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var titleText: TextView
    private lateinit var actionButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        titleText = findViewById(R.id.titleText)
        actionButton = findViewById(R.id.actionButton)

        actionButton.setOnClickListener {
            titleText.text = "Hello from eSmart World!"
        }
    }
}`,
  java: `package com.esmartworld.myapp;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private TextView titleText;
    private Button actionButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        titleText = findViewById(R.id.titleText);
        actionButton = findViewById(R.id.actionButton);

        actionButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                titleText.setText("Hello from eSmart World!");
            }
        });
    }
}`,
  reactNative: `import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const App = () => {
  const [message, setMessage] = useState('Welcome to eSmart World!');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>{message}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setMessage('Hello from Dr. Irfan!')}
        >
          <Text style={styles.buttonText}>Tap Me</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#E6EDF3', marginBottom: 32 },
  button: {
    backgroundColor: '#1F6FEB',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default App;`,
};

export const SAMPLE_PROJECTS: import('@/types').Project[] = [
  {
    id: 'proj_1',
    name: 'eSmart Commerce',
    description: 'Full-featured e-commerce Android app with cart, payments and order tracking',
    type: 'kotlin',
    status: 'ready',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2025-01-15T14:30:00Z',
    userId: 'user_1',
    packageName: 'com.esmartworld.commerce',
    versionName: '2.1.0',
    versionCode: 21,
    buildCount: 14,
    lastBuild: '2025-01-15T14:30:00Z',
    screens: [],
    files: [],
    settings: {
      minSdk: 24, targetSdk: 34, compileSdk: 34,
      buildTools: '34.0.0', gradleVersion: '8.2',
      kotlinVersion: '1.9.0', theme: 'Theme.Material3',
      orientation: 'portrait', permissions: ['INTERNET', 'CAMERA'],
    },
  },
  {
    id: 'proj_2',
    name: 'DrIrfan Health',
    description: 'Healthcare management app with appointments, records and telemedicine',
    type: 'react-native',
    status: 'building',
    createdAt: '2024-11-20T09:00:00Z',
    updatedAt: '2025-01-14T11:00:00Z',
    userId: 'user_1',
    packageName: 'com.drirfan.health',
    versionName: '1.0.5',
    versionCode: 5,
    buildCount: 7,
    lastBuild: '2025-01-14T11:00:00Z',
    screens: [],
    files: [],
    settings: {
      minSdk: 26, targetSdk: 34, compileSdk: 34,
      buildTools: '34.0.0', gradleVersion: '8.1',
      theme: 'Theme.Material3.DayNight',
      orientation: 'portrait', permissions: ['INTERNET', 'CAMERA', 'READ_CONTACTS'],
    },
  },
  {
    id: 'proj_3',
    name: 'Smart Learning',
    description: 'Educational platform with video lessons, quizzes and certificates',
    type: 'android',
    status: 'draft',
    createdAt: '2025-01-05T08:00:00Z',
    updatedAt: '2025-01-10T16:00:00Z',
    userId: 'user_1',
    packageName: 'com.esmartworld.learn',
    versionName: '0.9.0',
    versionCode: 9,
    buildCount: 3,
    screens: [],
    files: [],
    settings: {
      minSdk: 24, targetSdk: 34, compileSdk: 34,
      buildTools: '34.0.0', gradleVersion: '8.0',
      theme: 'Theme.Material3', orientation: 'both',
      permissions: ['INTERNET', 'WRITE_EXTERNAL_STORAGE'],
    },
  },
];

export const BUILD_SIMULATION_LOGS = [
  "[INFO] Starting Gradle build...",
  "[INFO] Checking dependencies...",
  "[INFO] :app:preBuild UP-TO-DATE",
  "[INFO] :app:preDebugBuild UP-TO-DATE",
  "[INFO] :app:compileDebugKotlin",
  "[INFO] Kotlin version: 1.9.0",
  "[INFO] :app:compileDebugJavaWithJavac",
  "[INFO] :app:mergeDebugResources",
  "[INFO] :app:processDebugManifest",
  "[INFO] :app:generateDebugBuildConfig",
  "[INFO] :app:mergeDebugAssets",
  "[INFO] :app:compressDebugAssets",
  "[INFO] :app:processDebugJavaRes",
  "[INFO] :app:dexBuilderDebug",
  "[INFO] :app:mergeDebugDex",
  "[INFO] :app:packageDebug",
  "[SUCCESS] BUILD SUCCESSFUL in 42s",
  "[SUCCESS] APK generated: app/build/outputs/apk/debug/app-debug.apk",
  "[INFO] APK size: 4.7 MB",
  "[INFO] Min SDK: 24 | Target SDK: 34",
  "[SUCCESS] Ready for download!",
];
