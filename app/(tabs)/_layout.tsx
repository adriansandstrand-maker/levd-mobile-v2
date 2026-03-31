import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Colors as ThemeColors } from '@/lib/theme';
import ScanModal from '@/components/ScanModal';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const [scanModalVisible, setScanModalVisible] = useState<boolean>(false);

  const handleFileSelected = (uri: string, name: string, mimeType: string) => {
    console.log('File selected:', { uri, name, mimeType });
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: ThemeColors.accent,
          tabBarInactiveTintColor: ThemeColors.textSecondary,
          tabBarStyle: {
            backgroundColor: ThemeColors.white,
            borderTopColor: ThemeColors.border,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Hjem',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: 'Skann',
            tabBarIcon: ({ color }) => <TabBarIcon name="camera" color={color} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setScanModalVisible(true);
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      </Tabs>
      <ScanModal
        visible={!!scanModalVisible}
        onClose={() => setScanModalVisible(false)}
        onFileSelected={handleFileSelected}
      />
    </>
  );
}
