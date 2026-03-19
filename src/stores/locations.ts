import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { locations } from "@/shared/utils/locations";

export const useLocationsStore = defineStore("locations", () => {
  const unlockedLocations = ref<string[]>(
    JSON.parse(
      localStorage.getItem("unlockedLocations") || '["forest", "city"]',
    ),
  );
  const showLocationUnlockModal = ref(false);
  const currentLocation = ref<any>(null);

  watch(
    unlockedLocations,
    (newUnlocked) => {
      localStorage.setItem("unlockedLocations", JSON.stringify(newUnlocked));
    },
    { deep: true },
  );

  const checkLocationUnlocks = (currentLevel: number) => {
    locations.forEach((location) => {
      if (
        !unlockedLocations.value.includes(location.key) &&
        currentLevel >= location.requiredLevel
      ) {
        unlockedLocations.value.push(location.key);
        showLocationUnlockModal.value = true;
        currentLocation.value = location;
      }
    });
  };

  return {
    unlockedLocations,
    showLocationUnlockModal,
    currentLocation,
    checkLocationUnlocks,
  };
});
