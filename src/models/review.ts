export interface Review {
    id: number;
    username?: string;
    restaurant_id: number;
    body: string;
    sentiment: string;
    time_review: string;
    created_at: string;
}