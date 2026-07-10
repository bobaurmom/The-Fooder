const BASE_DELIVERY_FEE = 1.5;
const DELIVERY_FEE_PER_KM = 0.35;

export function haversineDistanceKm(lat1, lng1, lat2, lng2) {
	const toRadians = (value) => (value * Math.PI) / 180;
	const earthRadiusKm = 6371;

	const latitudeDelta = toRadians(lat2 - lat1);
	const longitudeDelta = toRadians(lng2 - lng1);

	const a =
		Math.sin(latitudeDelta / 2) ** 2 +
		Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(longitudeDelta / 2) ** 2;

	return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateDeliveryFee(distanceKm) {
	const safeDistance = Number.isFinite(distanceKm) && distanceKm > 0 ? distanceKm : 0;
	return Number((BASE_DELIVERY_FEE + safeDistance * DELIVERY_FEE_PER_KM).toFixed(2));
}
