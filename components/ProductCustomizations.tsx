import { ProductCustomizationsProps } from '@/type'
import cn from "clsx"
import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'

const ProductCustomizations = ({ title, style, customizations }: ProductCustomizationsProps) => {
    return (
        <View className={cn("mt-8 flex-start gap-3", style)}>
            <Text className='base-bold font-bold text-dark-100'>{title}</Text>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={customizations}
                keyExtractor={item => item.customizations.$id}
                contentContainerClassName='gap-2'
                renderItem={({ item }) => (
                    <TouchableOpacity className='py-2.5 px-3 bg-[#3C2F2F] rounded-2xl flex-center flex-row gap-1'>
                        <Text className='paragraph-semibold text-white truncate'>{item.customizations.name}</Text>
                        <View className='w-5 h-5 flex-center bg-red-500 rounded-full'>
                            <Text className='text-white'>+</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default ProductCustomizations;