import CustomHeader from '@/components/CustomHeader'
import { images } from '@/constants'
import { appwriteConfig, signOut } from '@/lib/appwrite'
import useAuthStore from '@/store/auth.store'
import { router } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
    const { user, setIsAuthenticated } = useAuthStore()
    const imageUrl = `${user?.avatar}?project=${appwriteConfig.projectId}`

    const handleSignOut = async () => {
        try {
            await signOut()
            setIsAuthenticated(false)
            router.push('/sign-in')
        } catch (error: any) {
            throw new Error("Error signing out", error.message);
        }
    }

    return (
        <SafeAreaView className='bg-white h-full'>
            <View className='pb-28 px-5 pt-5'>
                <CustomHeader title='Profile' />
                <View className='flex-center'>
                    <Image
                        source={{ uri: imageUrl }}
                        className='profile-avatar'
                        resizeMode='contain'
                    />
                </View>
                <View className='my-6'>
                    <View className='profile-field'>
                        <View className='profile-field__icon'>
                            <Image
                                source={images.user}
                                resizeMode='contain'
                                className='size-5'
                            />
                        </View>
                        <View className='flex-1'>
                            <Text className='paragraph-medium text-gray-200'>Full Name</Text>
                            <Text className='paragraph-semibold text-dark-100'>{user?.name}</Text>
                        </View>
                    </View>
                    <View className='profile-field'>
                        <View className='profile-field__icon'>
                            <Image
                                source={images.phone}
                                resizeMode='contain'
                                className='size-5'
                            />
                        </View>
                        <View className='flex-1'>
                            <Text className='paragraph-medium text-gray-200'>Email</Text>
                            <Text className='paragraph-semibold text-dark-100'>{user?.email}</Text>
                        </View>
                    </View>
                </View>

                <View className='flex-center flex-col gap-5'>
                    <TouchableOpacity
                        className='custom-btn bg-primary/10 border-primary border'
                    >
                        <Text className='paragraph-bold text-primary'>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className='custom-btn bg-red-500/10 border border-red-500 flex-center'
                        onPress={handleSignOut}
                    >
                        <Image
                            source={images.logout}
                            resizeMode='contain'
                            className='size-6 mr-2'
                        />
                        <Text className='paragraph-bold text-red-500'>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Profile