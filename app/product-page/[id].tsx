import CustomHeader from '@/components/CustomHeader';
import { images } from '@/constants';
import { appwriteConfig, getCustomizations, getMenuItemById } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductPage = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data, loading, refetch } = useAppwrite({
        fn: getMenuItemById,
        params: { id }
    })
    const { data: customizations } = useAppwrite({ fn: getCustomizations })

    useEffect(() => {
        refetch({ id });
    }, [id]);

    if (loading) return <ActivityIndicator className='mt-20' />
    if (!data) return <Text className='p-5'>Product not found.</Text>;

    console.log(JSON.stringify(data, null, 2));
    

    const imageUrl = `${data?.image_url}?project=${appwriteConfig.projectId}`
    return (
        <SafeAreaView className='bg-white h-full'>
            <View className='pb-28 px-5 pt-5'>
                <CustomHeader />
                <View className='flex-between flex-row'>
                    <View className='flex-start gap-2'>
                        <Text className='h1-bold max-w-[80%] font-bold text-dark-100'>{data.name}</Text>
                        <View className='flex-center flex-row gap-2'>
                            <View className='flex-center flex-row'>
                                {Array.from({ length: Math.round(data.rating) }).map((_, index) => (
                                    <Image
                                        source={images.star}
                                        className='size-4'
                                        resizeMode='contain'
                                        key={index}
                                    />
                                ))}
                            </View>
                            <Text className='paragraph-semibold text-gray-200'>{data.rating}/5.0</Text>
                        </View>
                        <Text className='h3-bold font-bold text-dark-100'>
                            <Text className='text-primary'>$</Text>
                            {data.price}
                        </Text>
                        <View className='flex-center flex-row gap-5'>
                            <View className='flex-start gap-1'>
                                <Text className='paragraph-medium text-gray-200'>Calories</Text>
                                <Text className='paragraph-semibold text-dark-100'>{data.calories} Cal</Text>
                            </View>
                            <View className='flex-start gap-1'>
                                <Text className='paragraph-medium text-gray-200'>Protein</Text>
                                <Text className='paragraph-semibold text-dark-100'>{data.protein}g</Text>
                            </View>
                        </View>
                        <View className='flex-start gap-1'>
                            <Text className='paragraph-medium text-gray-200'>Category Type</Text>
                            <Text className='paragraph-semibold text-dark-100'>{data.categories.name}</Text>
                        </View>
                    </View>
                    <Image
                        source={{ uri: imageUrl }}
                        className='size-[300px] absolute -top-8 -right-32'
                        resizeMode='contain'
                    />
                </View>
                <View className='bg-primary/10 py-3 px-5 flex-between flex-row rounded-3xl mt-10'>
                    <View className='flex-center flex-row gap-1'>
                        <Image source={images.dollar} className='size-6' resizeMode='contain' />
                        <Text className='paragraph-semibold text-dark-100'>Free Delivery</Text>
                    </View>
                    <View className='flex-center flex-row gap-1'>
                        <Image source={images.clock} className='size-3' resizeMode='contain' />
                        <Text className='paragraph-semibold text-dark-100'>20 - 30 minutes</Text>
                    </View>
                    <View className='flex-center flex-row gap-1'>
                        <Image source={images.star} className='size-4' resizeMode='contain' />
                        <Text className='paragraph-semibold text-dark-100'>{data.rating}</Text>
                    </View>
                </View>
                <Text className='paragraph-medium text-gray-200 mt-8'>{data.description}</Text>
            </View>
        </SafeAreaView>
    );
};

export default ProductPage;
