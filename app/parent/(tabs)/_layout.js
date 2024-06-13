import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Tabs} from 'expo-router'

const ParentsTabLayout = () => {
  return (
    <Tabs>
        <Tabs.Screen name="home" options={{
            title: 'Home',
            // tabBarIcon: 'book-open',
        }} />
        <Tabs.Screen name="classlogs" options={{
            title: 'Classes',
            // tabBarIcon: 'book-open',
        }} />
        <Tabs.Screen name="analytics" options={{
            title: 'Analytics',
            // tabBarIcon: 'book-open',
        }} />
        <Tabs.Screen name="profile" options={{
            title: 'Profile',
            // tabBarIcon: 'book-open',
        }} />
    </Tabs>
  )
}

export default ParentsTabLayout

const styles = StyleSheet.create({})