import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/Global/HomeScreen';
import LoginScreen from './screens/Global/LoginScreen';
import SignUpScreen from './screens/Global/SignUpScreen';
import GiveJobScreen from './screens/Employers/GiveJobScreen';
import WantJobScreen from './screens/Workers/WantJobScreen';
import JobDetailScreen from './screens/JobDetailScreen';
import MyJobsScreen from './screens/MyJobsScreen';
import PaymentScreen from './screens/PaymentScreen';
import PostJobScreen from './screens/Employers/PostJobScreen';
import JobStatusScreen from './screens/Employers/JobStatusScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#FF5722' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        {/* employer */}
        <Stack.Screen name="GiveJob" component={GiveJobScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PostJob" component={PostJobScreen} options={{ title: 'Post a Job' }} />
        <Stack.Screen name="JobStatus" component={JobStatusScreen} options={{ headerShown: false }} />


        {/* worker */}
        <Stack.Screen name="WantJob" component={WantJobScreen} options={{ headerShown:false }} />
        <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Job Details' }} />
        <Stack.Screen name="MyJobs" component={MyJobsScreen} options={{ title: 'My Jobs' }} />
        <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Payment' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
