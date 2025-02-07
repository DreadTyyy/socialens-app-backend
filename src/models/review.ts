export interface Review {
    id: number;
    username?: string;
    restaurant_id: number;
    body: string;
    sentiment: string;
    time_review: string;
    created_at: string;
}

export interface Prediction {
    nama: string;
    restaurant_id: number;
    tanggal: string;
    body: string;
    prediksi: string;
}