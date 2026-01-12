import { ref, watch, computed } from "vue";
import { getPlaylists, getPlaylistNames } from "@/shared/utils/audioUtils";
import { useGameStore } from "@/stores/game";

export const useAudio = () => {
  const audioContext = ref<AudioContext | null>(null);
  const currentTrack = ref<HTMLAudioElement | null>(null);
  const isPlaying = ref(false);
  const volume = ref(parseFloat(localStorage.getItem("audioVolume") || "0.5"));
  const currentTime = ref(0);
  const duration = ref(0);
  const isShuffled = ref(false);
  const isRepeated = ref(false);
  const errorCount = ref(0);
  const MAX_ERROR_COUNT = 3;
  const loadingQueue = ref<string[]>([]); // Очередь загрузок

  const hoverBuffer = ref<AudioBuffer | null>(null);
  const clickBuffer = ref<AudioBuffer | null>(null);
  const userInteracted = ref(false);
  const { settings } = useGameStore();

  const currentTrackInfo = ref<{
    url: string;
    playlistName: string;
    trackIndex: number;
    trackTitle?: string;
  } | null>(null);

  const playlists = ref(getPlaylists());
  const playlistNames = ref(getPlaylistNames());
  const currentPlaylistIndex = ref(0);
  const currentIndex = ref(0);

  const masterVolume = ref(
    parseFloat(localStorage.getItem("masterVolume") || "1")
  );
  const musicVolume = ref(
    parseFloat(localStorage.getItem("musicVolume") || "0.5")
  );
  const ambientVolume = ref(
    parseFloat(localStorage.getItem("ambientVolume") || "0.3")
  );
  const interfaceVolume = ref(
    parseFloat(localStorage.getItem("interfaceVolume") || "0.5")
  );

  watch(masterVolume, (newVol) =>
    localStorage.setItem("masterVolume", newVol.toString())
  );
  watch(musicVolume, (newVol) =>
    localStorage.setItem("musicVolume", newVol.toString())
  );
  watch(ambientVolume, (newVol) =>
    localStorage.setItem("ambientVolume", newVol.toString())
  );
  watch(interfaceVolume, (newVol) =>
    localStorage.setItem("interfaceVolume", newVol.toString())
  );

  const allTracks = computed(() => {
    const tracks: Array<{
      url: string;
      playlistName: string;
      playlistIndex: number;
      trackIndex: number;
    }> = [];
    playlistNames.value.forEach((playlistName, playlistIndex) => {
      const playlist = playlists.value[playlistName];
      playlist.forEach((url, trackIndex) => {
        tracks.push({ url, playlistName, playlistIndex, trackIndex });
      });
    });
    return tracks;
  });

  watch(volume, (newVol) =>
    localStorage.setItem("audioVolume", newVol.toString())
  );

  const initAudio = async () => {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    if (audioContext.value.state === "suspended") {
      await audioContext.value.resume();
    }
  };

  const playSound = async (url: string) => {
    if (loadingQueue.value.length > 2) return; // Ограничение загрузок
    loadingQueue.value.push(url);
    try {
      // Для коротких звуков сразу использовать fallback (быстрее и надежнее)
      if (url.includes("/audio/interface/")) {
        const audio = new Audio(url);
        audio.volume = volume.value;
        audio.preload = "none";
        audio
          .play()
          .catch((err) => console.error("Interface sound failed:", err));
        return;
      }

      initAudio();
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Audio file not found: ${url}`);
        throw new Error("Audio file not found");
      }
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("audio/")) {
        console.warn(
          `Invalid content-type ${contentType} for ${url}, using fallback`
        );
        throw new Error("Not audio content");
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.value!.decodeAudioData(
        arrayBuffer
      );
      const source = audioContext.value!.createBufferSource();
      source.buffer = audioBuffer;
      const gainNode = audioContext.value!.createGain();
      gainNode.gain.value =
        volume.value *
        masterVolume.value *
        (url.includes("/interface/") ? interfaceVolume.value : 1);
      source.connect(gainNode);
      gainNode.connect(audioContext.value!.destination);
      source.start();
    } catch (error) {
      console.warn("Web Audio API failed, fallback:", error);
      const audio = new Audio(url);
      audio.volume =
        volume.value *
        masterVolume.value *
        (url.includes("/interface/") ? interfaceVolume.value : 1);
      audio.preload = "none";
      audio.play().catch((err) => console.error("Fallback failed:", err));
    } finally {
      loadingQueue.value = loadingQueue.value.filter((u) => u !== url);
    }
  };

  const playTrack = (
    url: string,
    index: number = 0,
    playlistIndex: number = 0,
    playlistName?: string,
    trackTitle?: string
  ) => {
    if (errorCount.value >= MAX_ERROR_COUNT) {
      console.error("Error limit exceeded. Stopping.");
      isPlaying.value = false;
      errorCount.value = 0;
      return;
    }

    if (currentTrack.value) {
      currentTrack.value.pause();
      currentTrack.value = null;
    }

    currentTrackInfo.value = {
      url,
      playlistName: playlistName || playlistNames.value[playlistIndex],
      trackIndex: index,
      trackTitle,
    };

    currentIndex.value = index;
    currentPlaylistIndex.value = playlistIndex;

    const audio = new Audio();
    audio.volume = volume.value * masterVolume.value * musicVolume.value;
    audio.preload = "metadata"; // Только метаданные для оптимизации
    audio.currentTime = 0;

    const handleTimeUpdate = () => {
      if (audio) {
        currentTime.value = audio.currentTime;
        duration.value = audio.duration || 0;
      }
    };

    const handleLoadedMetadata = () => {
      duration.value = audio.duration || 0;
      errorCount.value = 0;
    };

    const handleError = (e: Event) => {
      console.error("Audio error:", e, "URL:", url);
      errorCount.value++;
      if (errorCount.value < MAX_ERROR_COUNT) {
        setTimeout(() => nextTrack(), 500);
      } else {
        console.error("Too many errors. Stopping.");
        isPlaying.value = false;
        errorCount.value = 0;
      }
    };

    const handleEnded = () => {
      errorCount.value = 0;
      if (isRepeated.value) {
        audio.currentTime = 0;
        audio.play().catch(handleError);
      } else {
        nextTrack();
      }
    };

    audio.ontimeupdate = handleTimeUpdate;
    audio.onloadedmetadata = handleLoadedMetadata;
    audio.onerror = handleError;
    audio.onended = handleEnded;
    audio.src = url;
    currentTrack.value = audio;

    audio
      .play()
      .then(() => {
        isPlaying.value = true;
        console.log("Playing:", url);
      })
      .catch((error) => {
        console.error("Play error:", error);
        if (error.name === "NotAllowedError") {
          console.warn("Playback blocked by browser.");
          isPlaying.value = false;
        } else {
          handleError(error as any);
        }
      });
  };

  const pauseTrack = () => {
    if (currentTrack.value && !currentTrack.value.paused) {
      currentTrack.value.pause();
      isPlaying.value = false;
    }
  };

  const togglePlay = () => {
    if (currentTrack.value) {
      if (currentTrack.value.paused) {
        currentTrack.value
          .play()
          .then(() => {
            isPlaying.value = true;
            errorCount.value = 0;
          })
          .catch((err) => console.error("Resume error:", err));
      } else {
        pauseTrack();
      }
    } else {
      const currentPlaylist =
        playlists.value[playlistNames.value[currentPlaylistIndex.value]];
      if (currentPlaylist && currentPlaylist[0]) {
        playTrack(
          currentPlaylist[0],
          0,
          currentPlaylistIndex.value,
          playlistNames.value[currentPlaylistIndex.value]
        );
      }
    }
  };

  const setVolume = (vol: number) => {
    volume.value = Math.max(0, Math.min(1, vol));
    if (currentTrack.value) currentTrack.value.volume = volume.value;
  };

  const setCurrentTime = (time: number) => {
    currentTime.value = time;
    if (currentTrack.value) currentTrack.value.currentTime = time;
  };

  const getCurrentPlaylist = () =>
    playlists.value[playlistNames.value[currentPlaylistIndex.value]];

  const getRandomTrack = () => {
    if (allTracks.value.length === 0) return null;
    let randomIndex = Math.floor(Math.random() * allTracks.value.length);
    const currentTrackIndex = allTracks.value.findIndex(
      (track) =>
        track.playlistName === currentTrackInfo.value?.playlistName &&
        track.trackIndex === currentTrackInfo.value?.trackIndex
    );
    if (allTracks.value.length === 1) return allTracks.value[0];
    if (currentTrackIndex !== -1 && randomIndex === currentTrackIndex) {
      randomIndex = (randomIndex + 1) % allTracks.value.length;
    }
    return allTracks.value[randomIndex];
  };

  const nextTrack = () => {
    errorCount.value = 0;

    if (isShuffled.value) {
      const randomTrack = getRandomTrack();

      if (randomTrack) {
        playTrack(
          randomTrack.url,
          randomTrack.trackIndex,
          randomTrack.playlistIndex,
          randomTrack.playlistName
        );
      }

      return;
    }

    const currentPlaylist = getCurrentPlaylist();

    if (!currentPlaylist || currentPlaylist.length === 0) return;

    let nextIndex = currentIndex.value + 1;

    if (nextIndex >= currentPlaylist.length) {
      // Переход к следующему плейлисту

      let nextPlaylistIndex = currentPlaylistIndex.value + 1;

      if (nextPlaylistIndex >= playlistNames.value.length)
        nextPlaylistIndex = 0;

      const nextPlaylist =
        playlists.value[playlistNames.value[nextPlaylistIndex]];

      if (nextPlaylist && nextPlaylist[0]) {
        playTrack(
          nextPlaylist[0],
          0,
          nextPlaylistIndex,
          playlistNames.value[nextPlaylistIndex]
        );
      }
    } else {
      if (currentPlaylist[nextIndex]) {
        playTrack(
          currentPlaylist[nextIndex],
          nextIndex,
          currentPlaylistIndex.value,
          playlistNames.value[currentPlaylistIndex.value]
        );
      }
    }
  };

  const prevTrack = () => {
    errorCount.value = 0;
    if (isShuffled.value) {
      const randomTrack = getRandomTrack();
      if (randomTrack) {
        playTrack(
          randomTrack.url,
          randomTrack.trackIndex,
          randomTrack.playlistIndex,
          randomTrack.playlistName
        );
      }
      return;
    }
    const currentPlaylist = getCurrentPlaylist();
    if (!currentPlaylist || currentPlaylist.length === 0) return;
    if (currentTime.value > 2 && currentTrack.value) {
      setCurrentTime(0);
      return;
    }
    let prevIndex = currentIndex.value - 1;
    if (prevIndex < 0) {
      // Переход к предыдущему плейлисту
      let prevPlaylistIndex = currentPlaylistIndex.value - 1;
      if (prevPlaylistIndex < 0)
        prevPlaylistIndex = playlistNames.value.length - 1;
      const prevPlaylist =
        playlists.value[playlistNames.value[prevPlaylistIndex]];
      if (prevPlaylist && prevPlaylist[prevPlaylist.length - 1]) {
        playTrack(
          prevPlaylist[prevPlaylist.length - 1],
          prevPlaylist.length - 1,
          prevPlaylistIndex,
          playlistNames.value[prevPlaylistIndex]
        );
      }
    } else {
      if (currentPlaylist[prevIndex]) {
        playTrack(
          currentPlaylist[prevIndex],
          prevIndex,
          currentPlaylistIndex.value,
          playlistNames.value[currentPlaylistIndex.value]
        );
      }
    }
  };

  const toggleShuffle = () => {
    isShuffled.value = !isShuffled.value;
    console.log(`Shuffle: ${isShuffled.value ? "ON" : "OFF"}`);
  };

  const toggleRepeat = () => {
    isRepeated.value = !isRepeated.value;
    console.log(`Repeat: ${isRepeated.value ? "ON" : "OFF"}`);
  };

  const playCompleteSound = () => {
    if (!settings.hideSounds) {
      playSound("/audio/interface/xp.mp3");
    }
  };

  const playLevelUpSound = () => {
    if (!settings.hideSounds) {
      playSound("/audio/interface/level.mp3");
    }
  };

  const playHoverSound = () => {
    if (!settings.hideSounds) {
      if (!userInteracted.value) {
        initInterfaceSounds();
        return;
      }
      if (hoverBuffer.value) {
        try {
          initAudio();
          const source = audioContext.value!.createBufferSource();
          source.buffer = hoverBuffer.value;
          const gainNode = audioContext.value!.createGain();
          gainNode.gain.value =
            volume.value * masterVolume.value * interfaceVolume.value;
          source.connect(gainNode);
          gainNode.connect(audioContext.value!.destination);
          source.start();
        } catch (error) {
          console.error("Hover sound error:", error);
        }
      }
    }
  };

  const playClickSound = () => {
    userInteracted.value = true;
    if (!settings.hideSounds) {
      initInterfaceSounds();
      if (clickBuffer.value) {
        try {
          initAudio();
          const source = audioContext.value!.createBufferSource();
          source.buffer = clickBuffer.value;
          const gainNode = audioContext.value!.createGain();
          gainNode.gain.value =
            volume.value * masterVolume.value * interfaceVolume.value;
          source.connect(gainNode);
          gainNode.connect(audioContext.value!.destination);
          source.start();
        } catch (error) {
          console.error("Click sound error:", error);
        }
      }
    }
  };

  // Обновление громкости в реальном времени
  watch(
    [
      () => masterVolume,
      () => musicVolume,
      () => ambientVolume,
      () => interfaceVolume,
    ],
    () => {
      if (currentTrack.value) {
        currentTrack.value.volume =
          volume.value * masterVolume.value * musicVolume.value;
      }
    },
    { immediate: true }
  );

  const initInterfaceSounds = async () => {
    if (!hoverBuffer.value) {
      try {
        initAudio();
        const [hoverResponse, clickResponse] = await Promise.all([
          fetch("/audio/interface/hover.mp3"),
          fetch("/audio/interface/click.mp3"),
        ]);
        const [hoverArrayBuffer, clickArrayBuffer] = await Promise.all([
          hoverResponse.arrayBuffer(),
          clickResponse.arrayBuffer(),
        ]);
        hoverBuffer.value = await audioContext.value!.decodeAudioData(
          hoverArrayBuffer
        );
        clickBuffer.value = await audioContext.value!.decodeAudioData(
          clickArrayBuffer
        );
      } catch (error) {
        console.warn("Failed to preload interface sounds:", error);
      }
    }
  };

  return {
    playSound,
    playTrack,
    pauseTrack,
    togglePlay,
    setVolume,
    setCurrentTime,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    isPlaying,
    volume,
    currentTime,
    duration,
    isShuffled,
    isRepeated,
    playlists,
    playlistNames,
    currentPlaylistIndex,
    currentIndex,
    currentTrackInfo,
    playHoverSound,
    playClickSound,
    playCompleteSound,
    playLevelUpSound,
    initInterfaceSounds,
    masterVolume,
    musicVolume,
    ambientVolume,
    interfaceVolume,
  };
};
