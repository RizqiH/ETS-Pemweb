import { initializeApp } from 'firebase/app';
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Product {
	name: string;
	price: number;
	image: null | string;
	sizes: string[];
	availableSizes: string[];
	category: string[];  // Menambahkan kategori
  }
  
  interface StoredProduct extends Product {
	id: string;
  }
  

/**
 * Fungsi untuk menyimpan produk ke Firestore dengan gambar dari Cloudinary
 * @param product Data produk yang akan disimpan
 * @param imageFile File gambar (opsional)
 * @returns Promise dengan ID dokumen
 */
const saveProductWithImage = async (product: Product, imageFile?: File): Promise<string> => {
	try {
	  // Jika ada file gambar, upload ke Cloudinary dahulu
	  if (imageFile) {
		const imageUrl = await uploadImage(imageFile);
		product.image = imageUrl;
	  }
  
	  // Simpan produk dengan URL gambar dan kategori ke Firestore
	  const docRef = await addDoc(collection(db, 'products'), product);
	  console.log('Produk berhasil disimpan dengan ID:', docRef.id);
	  return docRef.id;
	} catch (e) {
	  console.error('Error saat menyimpan produk:', e);
	  throw e;
	}
  };
  
  const saveProduct = async (product: Product): Promise<string> => {
	try {
	  const docRef = await addDoc(collection(db, 'products'), product);
	  console.log('Produk berhasil disimpan dengan ID:', docRef.id);
	  return docRef.id;
	} catch (e) {
	  console.error('Error saat menyimpan produk:', e);
	  throw e;
	}
  };
  

/**
 * Fungsi untuk mengambil semua produk dari Firestore
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
		  category: data.category || ''  // Menambahkan kategori
		});
	  });
  
	  console.log(`Berhasil mengambil ${products.length} produk dari database`);
	  return products;
	} catch (e) {
	  console.error('Error saat mengambil produk:', e);
	  throw e;
	}
  };
  

export { saveProduct, saveProductWithImage, getProducts };
