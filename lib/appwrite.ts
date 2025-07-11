import { CreateUserParams, GetMenuParams, SignInParams } from "@/type"
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite"

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: "com.mst.firstmobileapp",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: "686fadd70019bbe100e1",
    bucketId: "68721392003b864983b3",
    userCollectionId: "686fae09001edeecb2dd",
    categoriesCollectionId: "687122150038423da486",
    menuCollectionId: "6871238f0031a88279fd",
    customizationsCollectionId: "687217c1003c6e369e2c",
    menuCustomizationsCollectionId: "68721278000f2f45e199"
}

export const client = new Client()

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
const avatars = new Avatars(client)

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)

        if (!newAccount) throw Error;

        await signIn({ email, password })

        const avatarUrl = avatars.getInitialsURL(name)

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { accountId: newAccount.$id, email, name, avatar: avatarUrl }
        );
    } catch (error) {
        throw new Error(error as string)
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (error) {
        throw new Error(error as string)
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get()

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0]
    } catch (error) {
        console.error(error);
        throw new Error(error as string)
    }
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        const queries: string[] = []

        if (category) queries.push(Query.equal("categories", category))
        if (query) queries.push(Query.search("name", query))

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries
        )

        return menus.documents
    } catch (error) {
        throw new Error(error as string)
    }
}

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId
        )

        return categories.documents
    } catch (error) {
        throw new Error(error as string)
    }
}