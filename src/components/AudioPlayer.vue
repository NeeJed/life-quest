<template>
  <div class="audio-player bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border-2 border-muted-gold/50 fixed bottom-4 right-4 z-10">
    <h3 class="text-lg font-semibold text-rich-brown mb-2">🎵 Плейлист</h3>
    
    <div v-if="displayedTrackInfo" class="mb-3 p-2 bg-muted-gold/20 rounded-lg">
      <div class="text-sm text-rich-brown font-medium">Сейчас играет: {{ displayedTrackInfo.title }}</div>
      <div class="text-xs text-rich-brown/70">
        Плейлист: {{ displayedPlaylistName }}
        <span v-if="isShuffled" class="ml-2 text-blue-600" title="Перемешать">🔀</span>
        <span v-if="isRepeated" class="ml-2 text-green-600" title="Повторять">🔁</span>
      </div>
    </div>
    
    <div v-if="showErrorMessage" class="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
      <p class="text-sm">Ошибка воспроизведения. Проверьте файлы в /audio/</p>
      <button @click="showErrorMessage = false" class="text-xs underline mt-1">Скрыть</button>
    </div>
    
    <BaseSelect v-model="selectedPlaylist" @change="changePlaylist" class="mb-2">
      <option v-for="name in playlistNames" :key="name" :value="name">{{ playlistLabels[name] }}</option>
    </BaseSelect>
    
    <div class="space-y-2">
      <div v-for="(track, index) in playlist" :key="track.id" class="flex justify-between items-center p-1 rounded hover:bg-muted-gold/10">
        <span class="text-rich-brown">{{ track.title }}</span>
        <BaseButton @click="playTrack(track.url, index, track.title)" variant="primary" size="sm" :disabled="isTrackPlaying(track.url)">
          {{ getPlayButtonIcon(track.url) }}
        </BaseButton>
      </div>
    </div>
    
    <div class="mt-4 flex items-center gap-2">
      <BaseButton @click="prevTrack" :disabled="!currentPlayingTrackInfo">⏮</BaseButton>
      <BaseButton @click="toggleShuffle" :variant="isShuffled ? 'primary' : 'secondary'">🔀</BaseButton>
      <BaseButton @click="toggleRepeat" :variant="isRepeated ? 'primary' : 'secondary'">🔁</BaseButton>
      <BaseButton @click="togglePlay" :variant="isPlaying ? 'secondary' : 'primary'" :disabled="!currentPlayingTrackInfo">{{ isPlaying ? '⏸' : '▶' }}</BaseButton>
      <BaseButton @click="nextTrack" :disabled="!currentPlayingTrackInfo">⏭</BaseButton>
      <BaseInput type="range" v-model="volume" :min="'0'" :max="'1'" :step="'0.01'" @update:modelValue="handleVolumeChange" class="w-16" />
    </div>
    
    <div class="mt-2">
      <BaseInput type="range" v-model="currentTime" :min="'0'" :max="duration.toString()" :step="'1'" @update:modelValue="handleTimeChange" class="w-full" :disabled="!currentPlayingTrackInfo" />
      <div class="flex justify-between text-xs text-rich-brown">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAudio } from '@/shared/hooks/useAudio';
import { getPlaylistData, getPlaylistNames, getPlaylistLabels, formatTime } from '@/shared/utils/audioUtils';

const { playTrack: audioPlayTrack, pauseTrack, togglePlay, setVolume, setCurrentTime, nextTrack, prevTrack, toggleShuffle, toggleRepeat, isPlaying, volume, currentTime, duration, isShuffled, isRepeated, currentTrackInfo } = useAudio();
const selectedPlaylist = ref<'nature' | 'city' | 'madcon'>('nature');
const showErrorMessage = ref(false);

const playlistsData = getPlaylistData();
const playlistNames = getPlaylistNames();
const playlistLabels = getPlaylistLabels();
const playlist = computed(() => playlistsData[selectedPlaylist.value]);

console.log(playlistsData)

const displayedTrackInfo = computed(() => {
  if (!currentTrackInfo.value) return null;
  for (const playlistName in playlistsData) {
    const track = playlistsData[playlistName].find(t => t.url === currentTrackInfo.value!.url);
    if (track) return { ...track, playlistName: playlistLabels[playlistName] };
  }
  return null;
});

const currentPlayingTrackInfo = computed(() => currentTrackInfo.value);
const displayedPlaylistName = computed(() => displayedTrackInfo.value?.playlistName || '');

const isTrackPlaying = (url: string) => currentTrackInfo.value?.url === url;
const getPlayButtonIcon = (url: string) => isTrackPlaying(url) ? (isPlaying.value ? '▶▶' : '▶') : '▶';

watch(selectedPlaylist, () => showErrorMessage.value = false, { immediate: true });

const changePlaylist = () => console.log('Playlist changed to:', selectedPlaylist.value);

const playTrack = (url: string, index: number, trackTitle: string) => {
  try {
    let playlistIndex = 0, playlistName = 'nature';
    for (let i = 0; i < playlistNames.length; i++) {
      if (playlistsData[playlistNames[i]].some(track => track.url === url)) {
        playlistIndex = i;
        playlistName = playlistNames[i];
        break;
      }
    }
    const actualIndex = playlistsData[playlistName].findIndex(track => track.url === url);
    audioPlayTrack(url, actualIndex, playlistIndex, playlistName, trackTitle);
    showErrorMessage.value = false;
  } catch (error) {
    console.error('Play error:', error);
    showErrorMessage.value = true;
  }
};

const handleVolumeChange = (value: string | number | boolean) => typeof value === 'number' && setVolume(value);
const handleTimeChange = (value: string | number | boolean) => typeof value === 'number' && setCurrentTime(value);
</script>