import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import ChartsScreen from './src/screens/ChartsScreen';
import TablesScreen from './src/screens/TablesScreen';
import CustomHeader from './src/components/CustomHeader';
import ProfileScreen from './src/screens/ProfileScreen';
import StartupScreen from './src/screens/StartupScreen';
import AboutScreen from './src/screens/AboutScreen';
import CreateOutcomeScreen from './src/screens/CreateOutcomeScreen';
import DevelopmentOutcomesScreen from './src/screens/AdminScreens/DevelopmentOutComesScreen';
import Wards from './src/screens/AdminScreens/WardsScreen';
import Users from './src/screens/AdminScreens/UsersScreen';
import Roles from './src/screens/AdminScreens/RolesScreen';
import IndicatorsScreen from './src/screens/IndicatorsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  const [showSearch, setShowSearch] = React.useState(false);
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        header: ({ navigation }) => (
          <CustomHeader
            title={route.name}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
          />
        ),
      })}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function ChartsStack() {
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        header: ({ navigation }) => (
          <CustomHeader
            title={route.name}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
          />
        ),
      })}
    >
      <Stack.Screen name="Charts" component={ChartsScreen} />
    </Stack.Navigator>
  );
}

function TablesStack() {
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        header: ({ navigation }) => (
          <CustomHeader
            title={route.name}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
          />
        ),
      })}
    >
      <Stack.Screen name="Tables" component={TablesScreen} />
    </Stack.Navigator>
  );
}

function IndicatorsStack() {
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        header: ({ navigation }) => (
          <CustomHeader
            title={route.name}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
          />
        ),
      })}
    >
      <Stack.Screen name="Indicators" component={IndicatorsScreen} />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#f4f0f4',
        },
        tabBarActiveTintColor: '#1b2c00',
        tabBarInactiveTintColor: '#f46500',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Charts') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Tables') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Indicators') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        children={(props) => <HomeStack {...props} />}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Charts"
        component={ChartsStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Tables"
        component={TablesStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Indicators"
        component={IndicatorsStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function MainStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        header: ({ navigation }) => (
          <CustomHeader
            title={route.name}
            showSearch={false}
            setShowSearch={() => {}}
          />
        ),
      })}
    >
      <Stack.Screen
        name="MainTabs"
        children={(props) => <MainTabNavigator {...props} />}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="IndicatorsScreen" component={IndicatorsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Tables" component={TablesScreen} />
      <Stack.Screen name="Charts" component={ChartsScreen} />
      <Stack.Screen name="DevelopmentOutcomes" component={DevelopmentOutcomesScreen} />
      <Stack.Screen name="Wards" component={Wards} />
      <Stack.Screen name="Users" component={Users} />
      <Stack.Screen name="Roles" component={Roles} />
      <Stack.Screen name="CreateOutcome" component={CreateOutcomeScreen} />
    </Stack.Navigator>
  );
}

function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  // Handle the startup screen timeout
  const handleStartupScreenTimeout = () => {
    setIsLoading(false);
  };

  // Show startup screen if loading
  if (isLoading) {
    return <StartupScreen onTimeout={handleStartupScreenTimeout} />;
  }

  return (
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
}

export default App;