import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './Profile';
import RegisterProduct from './RegisterProduct';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCamera } from '@hooks/camera';
import { useAuth } from '@hooks/auth';
import ProductsRoutes from './Products';

const Tab = createBottomTabNavigator();

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { isCameraVisible } = useCamera();

    return (
        <Tab.Navigator
            tabBarOptions={{
                labelStyle: {
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 10,
                    color: 'black',
                },
                allowFontScaling: true,
                style: {
                    borderTopColor: '#4058af',
                    borderTopWidth: 1,
                    display: isCameraVisible ? 'none' : 'flex',
                },
            }}
        >
            {user.companyId && (
                <>
                    <Tab.Screen
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <Icon
                                    name="inventory"
                                    size={22}
                                    color={focused ? '#1c274e' : '#4058af'}
                                />
                            ),
                            tabBarLabel: 'Estoque',
                            unmountOnBlur: true,
                        }}
                        name="Products"
                        component={ProductsRoutes}
                    />
                    <Tab.Screen
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <Icon
                                    name="add"
                                    size={30}
                                    color={focused ? '#1c274e' : '#4058af'}
                                />
                            ),
                            tabBarLabel: 'Cadastrar produto',
                            unmountOnBlur: true,
                        }}
                        name="RegisterProduct"
                        component={RegisterProduct}
                    />
                </>
            )}

            <Tab.Screen
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="person"
                            size={22}
                            color={focused ? '#1c274e' : '#4058af'}
                        />
                    ),
                    tabBarLabel: 'Perfil',
                }}
                name="Profile"
                component={Profile}
            />
        </Tab.Navigator>
    );
};

export default Dashboard;
