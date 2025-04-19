import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

const uploadImage = async (file: File) => {
	const formData = new FormData();
	formData.append('file', file); // Menambahkan file gambar
	formData.append('upload_preset', 'ml_default'); // Ganti dengan preset yang valid

	try {
		const response = await axios.post(
			`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
			formData
		);
		console.log('Gambar berhasil diunggah:', response.data.secure_url);
		return response.data.secure_url; // Mengembalikan URL gambar yang valid
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			console.error('Error uploading image:', error.response.data);
		} else {
			console.error('Error uploading image:', error);
		}
		throw error;
	}
};

export { uploadImage };
