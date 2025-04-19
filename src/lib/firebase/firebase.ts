import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { uploadImage } from '$lib/cloudinary';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

interface Product {
  name: string;
  price: number;
  image: null | string;
  sizes: string[];
  availableSizes: string[];
}

interface StoredProduct extends Product {
  id: string;
}

/**
 * Function to save product to Firestore with image from Cloudinary
 * @param product The product data to save
 * @param imageFile The image file (optional)
 * @returns A promise with the document ID
 */
const saveProductWithImage = async (product: Product, imageFile?: File): Promise<string> => {
  try {
    // If there's an image file, upload it to Cloudinary first
    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      product.image = imageUrl;
    }

    // Save product with image URL and category to Firestore
    const docRef = await addDoc(collection(db, 'products'), product);
    console.log('Product successfully saved with ID:', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error saving product:', e);
    throw e;
  }
};

const saveProduct = async (product: Product): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'products'), product);
    console.log('Product successfully saved with ID:', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error saving product:', e);
    throw e;
  }
};

/**
 * Function to get all products from Firestore
 */
const getProducts = async (): Promise<StoredProduct[]> => {
  try {
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);

    const products: StoredProduct[] = [];
    productsSnapshot.forEach((doc) => {
      const data = doc.data() as Product;
      products.push({
        id: doc.id,
        name: data.name,
        price: data.price,
        image: data.image,
        sizes: data.sizes || [],
        availableSizes: data.availableSizes || [],
      });
    });

    console.log(`Successfully retrieved ${products.length} products from the database`);
    return products;
  } catch (e) {
    console.error('Error retrieving products:', e);
    throw e;
  }
};

export { saveProduct, saveProductWithImage, getProducts };
