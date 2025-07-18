import { appwriteConfig } from '@/lib/appwrite'
import { useCartStore } from '@/store/cart.store'
import { MenuItem } from '@/type'
import { router } from 'expo-router'
import React from 'react'
import { Image, Platform, Text, TouchableOpacity } from 'react-native'

const MenuCard = ({ item: { $id, image_url, name, price } }: { item: MenuItem }) => {
    const imageUrl = `${image_url}?project=${appwriteConfig.projectId}`;
    const { addItem, items } = useCartStore()

    const isItemInCart = items.some((item) => item.id === $id);

    return (
        <TouchableOpacity
            className='menu-card'
            style={Platform.OS === "android" ? { elevation: 10, shadowColor: "#878787" } : {}}
            onPress={() => router.push({ pathname: "/product-page/[id]", params: { id: $id } })}
        >
            <Image source={{ uri: imageUrl }} className='size-32 absolute -top-10' resizeMode='contain' />
            <Text className='text-center base-bold text-dark-100 mb-2' numberOfLines={1}>{name}</Text>
            <Text className='body-regular text-gray-200 mb-4'>From ${price}</Text>
            {isItemInCart ? (
                <TouchableOpacity onPress={() => router.push("/cart")}>
                    <Text className='paragraph-bold text-gray-600'>View in Cart</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={() => addItem({ id: $id, name, image_url: imageUrl, price, customizations: [] })}
                >
                    <Text className='paragraph-bold text-primary'>Add to Cart +</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity >
    )
}

export default MenuCard