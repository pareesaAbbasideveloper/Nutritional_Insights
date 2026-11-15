/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {LogBox} from 'react-native';

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './Login';
import SignUp from './SignUp';
import Questions from './Questions';
import Topbar from '../components/Topbar';
import InformationSaved from './InformationSaved';
import ScanNow from './ScanNow';
import DetailInformation from './DetailInformation';
import MakingReady from './MakingReady';

import Profile from './Profile';
import Support from './Support';
import Prelogin from './Prelogin';
import FoodDetailShowCase from './FoodDetailShowCase';
import Alternative from './Alternative';
import EditQuestions from './EditQuestions';
import GetCode from './GetCode';
import ForgetPassword from './ForgetPassword';
import NewPassword from './NewPassword';
import Community from './Community';
import {Chat, OverlayProvider} from 'stream-chat-react-native';
import {StreamChat} from 'stream-chat';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AIChatScreen from './AIChat';
const chatClient = StreamChat.getInstance('f4jd4sm2swcv');

const Stack = createNativeStackNavigator();

const App = () => {
 
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <OverlayProvider>
        <Chat client={chatClient}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Prelogin"
                component={Prelogin}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Scan"
                component={ScanNow}
                options={{
                  headerTitle: props => <Topbar {...props} />,
                  headerStyle: {
                    backgroundColor: '#686f89',
                    color: 'white', // Set your desired background color
                  },
                }}
              />
              <Stack.Screen
                name="Community"
                component={Community}
                options={{
                  headerTitle: props => <Topbar {...props} />,
                  headerStyle: {
                    backgroundColor: '#686f89',
                    color: 'white', // Set your desired background color
                  },
                }}
              />
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="EditQuestions"
                component={EditQuestions}
                options={{
                  headerTitle: props => <Topbar {...props} />,
                  headerStyle: {
                    backgroundColor: '#686f89',
                    color: 'white', // Set your desired background color
                  },
                }}
              />

              <Stack.Screen
                name="Questions"
                component={Questions}
                options={{
                  headerTitle: props => <Topbar {...props} />,
                  headerStyle: {
                    backgroundColor: '#686f89',
                    color: 'white', // Set your desired background color
                  },
                }}
              />
              <Stack.Screen
                name="login"
                component={Login}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="ForgetPassword"
                component={ForgetPassword}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="GetCode"
                component={GetCode}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="NewPassword"
                component={NewPassword}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="AIChatScreen"
                component={AIChatScreen}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="Alternative"
                component={Alternative}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="MakingReady"
                component={MakingReady}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="FoodDetailShowCase"
                component={FoodDetailShowCase}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="InformationSaved"
                component={InformationSaved}
                options={{
                  headerTitle: props => <Topbar {...props} />,
                  headerStyle: {
                    backgroundColor: '#686f89',
                    color: 'white', // Set your desired background color
                  },
                }}
              />
              <Stack.Screen
                name="Signup"
                component={SignUp}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Support"
                component={Support}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Chat>
      </OverlayProvider>
    </GestureHandlerRootView>
  );
};

export default App;
