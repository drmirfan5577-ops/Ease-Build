export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "developer" | "viewer";
  createdAt: string;
  plan: "free" | "pro" | "enterprise";
  avatar?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  role?: string;
  plan?: string;
}

export type ComponentType =
  | "Button" | "TextView" | "EditText" | "ImageView" | "CardView"
  | "Toolbar" | "CheckBox" | "Switch" | "ProgressBar" | "BottomNavigation"
  | "FloatingActionButton" | "RadioButton" | "SeekBar" | "Spinner"
  | "LinearLayout" | "RelativeLayout" | "ConstraintLayout" | "ScrollView"
  | "RecyclerView" | "ListView" | "WebView" | "MapView" | "VideoView"
  | "View" | "Text" | "TextInput" | "Image" | "FlatList"
  | "TouchableOpacity" | "Pressable" | "ActivityIndicator"
  | "StatusBar" | "SafeAreaView" | "Modal" | "Alert"
  | "KeyboardAvoidingView" | "Camera";

export interface UIComponent {
  id: string;
  type: ComponentType;
  props: Record<string, unknown>;
  x: number;
  y: number;
  width: number;
  height: number;
  styles: Record<string, unknown>;
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  size: number;
}

export interface ProjectScreen {
  id: string;
  name: string;
  components: UIComponent[];
}

export interface ProjectSettings {
  minSdk: number;
  targetSdk: number;
  compileSdk: number;
  buildTools: string;
  gradleVersion?: string;
  kotlinVersion?: string;
  theme: string;
  orientation: "portrait" | "landscape" | "both";
  permissions: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: "kotlin" | "java" | "react-native" | "android";
  status: "draft" | "building" | "ready" | "published" | "failed";
  createdAt: string;
  updatedAt: string;
  userId: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  buildCount: number;
  lastBuild?: string;
  screens: ProjectScreen[];
  files: ProjectFile[];
  settings: ProjectSettings;
}

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "editor" | "viewer";
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  inviteCode: string;
  members: TeamMember[];
  createdAt: string;
}

export interface Asset {
  id: string;
  name: string;
  fileUrl: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  projectId?: string;
  createdAt: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ScreenTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  components: UIComponent[];
  tags: string[];
  framework: "android" | "react-native" | "both";
}
