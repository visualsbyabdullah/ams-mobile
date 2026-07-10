import * as Location from "expo-location";

export type PreciseLocationPayload = {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  preciseLocationVerified: boolean;
};

export const DEFAULT_MAX_LOCATION_ACCURACY_METERS = 30;

export const getPreciseLocation = async (
  maxAccuracyMeters = DEFAULT_MAX_LOCATION_ACCURACY_METERS
): Promise<PreciseLocationPayload> => {
  const permission = await Location.requestForegroundPermissionsAsync();

  if (permission.status !== "granted") {
    throw new Error("LOCATION_PERMISSION_DENIED");
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
  });

  const accuracy = location.coords.accuracy;

  if (typeof accuracy !== "number") {
    throw new Error("LOCATION_ACCURACY_UNAVAILABLE");
  }

  if (accuracy > maxAccuracyMeters) {
    throw new Error(`LOCATION_NOT_PRECISE_${Math.round(accuracy)}M`);
  }

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    accuracyMeters: accuracy,
    preciseLocationVerified: true,
  };
};
