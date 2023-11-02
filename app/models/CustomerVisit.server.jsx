import db from "../db.server";

export async function getLastUpdatedAt() {
    const lastCustomerVisit = await db.customerVisit.aggregate({
        _max: {
            orderUpdatedAt: true
        }
    });
    
    const lastUpdatedAt = lastCustomerVisit._max.orderUpdatedAt;

    return lastUpdatedAt;
}