import CustomHeader from '@/components/CustomHeader';
import { UpdateCurrentUser } from '@/lib/appwrite';
import useAuthStore from '@/store/auth.store';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FormValues = {
    name: string;
    email: string;
};

const EditProfile = () => {
    const { user, fetchAuthenticatedUser } = useAuthStore();
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [isSaving, setIsSaving] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    });

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const onSubmit = async (data: FormValues) => {
        setIsSaving(true);

        try {
            await UpdateCurrentUser({ ...data, avatar }, user!.$id);

            Alert.alert('Success', 'Profile updated');
            fetchAuthenticatedUser();
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView className='bg-white h-full px-5 pt-5'>
            <CustomHeader title='Edit Profile' />
            <View className='items-center mb-8'>
                <TouchableOpacity onPress={pickImage}>
                    {avatar ? (
                        <Image source={{ uri: avatar }} className='w-28 h-28 rounded-full bg-gray-300' />
                    ) : (
                        <View className='w-28 h-28 rounded-full bg-pink-500' />
                    )}
                </TouchableOpacity>
                <Text className='text-sm text-gray-400 mt-2'>Tap to change avatar</Text>
            </View>

            <View className='mb-5'>
                <Text className='text-gray-400 mb-1'>Full Name</Text>
                <Controller
                    control={control}
                    name='name'
                    rules={{ required: 'Name is required' }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            className='border rounded-xl p-3'
                            onChangeText={onChange}
                            value={value}
                            placeholder='Enter your name'
                        />
                    )}
                />
                {errors.name && <Text className='text-red-500 mt-1'>{errors.name.message}</Text>}
            </View>

            <View className='mb-8'>
                <Text className='text-gray-400 mb-1'>Email</Text>
                <Controller
                    control={control}
                    name='email'
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email format',
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            className='border rounded-xl p-3'
                            onChangeText={onChange}
                            value={value}
                            placeholder='Enter your email'
                            autoCapitalize='none'
                            keyboardType='email-address'
                        />
                    )}
                />
                {errors.email && <Text className='text-red-500 mt-1'>{errors.email.message}</Text>}
            </View>

            <TouchableOpacity
                className='bg-orange-100 py-4 rounded-full border border-orange-500'
                onPress={handleSubmit(onSubmit)}
                disabled={isSaving}
            >
                <Text className='text-orange-500 text-center font-semibold text-base'>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default EditProfile;
