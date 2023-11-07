import db from "../db.server";

export async function getLastUpdatedAt() {
    const lastCustomerVisit = await db.trailPixel.aggregate({
        _max: {
            order_updated_at: true
        }
    });
    
    const lastUpdatedAt = lastCustomerVisit._max.order_updated_at;

    return lastUpdatedAt;
}