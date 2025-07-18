import CustomHeader from '@/components/CustomHeader';
import ProductCustomizations from '@/components/ProductCustomizations';
import { images } from '@/constants';
import { appwriteConfig, getMenuItemById } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import { useCartStore } from '@/store/cart.store';
import { CartCustomization } from '@/type';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductPage = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { items, addItem, increaseQty, decreaseQty, removeItem } = useCartStore();
    const { data, loading, refetch } = useAppwrite({
        fn: getMenuItemById,
        params: { id }
    })

    useEffect(() => {
        refetch({ id });
    }, [id]);

    if (loading) return <ActivityIndicator className='mt-20' />
    if (!data) return <Text className='p-5'>Product not found.</Text>;

    const imageUrl = `${data?.image_url}?project=${appwriteConfig.projectId}`

    const toppings = data.menuCustomizations.filter((menuCustomization: { customizations: CartCustomization }) => menuCustomization.customizations.type === 'topping');
    const sides = data.menuCustomizations.filter((menuCustomization: { customizations: CartCustomization }) => menuCustomization.customizations.type === 'side');

    const isItemInCart: any = items.filter((item) => item.id === id)[0];

    console.log(isItemInCart);

    return (
        <SafeAreaView className='bg-white h-full relative'>
            <ScrollView className='pb-28 px-5 pt-5'>
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

                <ProductCustomizations title='Toppings' customizations={toppings} />

                <ProductCustomizations title='Sides' customizations={sides} />

            </ScrollView>

            {Boolean(isItemInCart) ? (
                <View className="flex-center flex-row gap-x-4 mt-2 bg-primary/10 py-3 px-5 rounded-3xl mx-5">
                    <TouchableOpacity
                        onPress={() => decreaseQty(isItemInCart.id, isItemInCart.customizations!)}
                        className="cart-item__actions w-14 h-14"
                    >
                        <Image
                            source={images.minus}
                            className="size-1/3"
                            resizeMode="contain"
                            tintColor={"#FF9C01"}
                        />
                    </TouchableOpacity>

                    <Text className="h3-bold font-bold text-dark-100">{isItemInCart.quantity}</Text>

                    <TouchableOpacity
                        onPress={() => increaseQty(isItemInCart.id, isItemInCart.customizations!)}
                        className="cart-item__actions w-14 h-14"
                    >
                        <Image
                            source={images.plus}
                            className="size-1/3"
                            resizeMode="contain"
                            tintColor={"#FF9C01"}
                        />
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    className='fixed bottom-0 mx-5 bg-primary py-3.5 px-7 rounded-3xl flex-center flex-row gap-3 mt-10'
                    onPress={() => addItem({ id: data.$id, name: data.name, image_url: imageUrl, price: data.price, customizations: [] })}
                >
                    <Image
                        source={images.bag}
                        className='size-5'
                        resizeMode='contain'
                    />
                    <Text className='paragraph-bold text-white'>Add to Cart</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default ProductPage;
