<template>
  <div class="p-4">
    <iframe width="560" height="315" src="http://127.0.0.1:8889/hg" frameborder="0" allowfullscreen autoplay playsinline></iframe>
    <div v-if="metadata" class="bg-gray-100 p-4 rounded shadow">
      <p><strong>Status:</strong> {{ metadata.status }}</p>
      <p><strong>Song:</strong> {{ metadata.name }}</p>
      <p><strong>Singer:</strong> {{ metadata.singer }}</p>
      <p><strong>Album:</strong> {{ metadata.albumName }}</p>
      <p><strong>Duration:</strong> {{ formatTime(metadata.duration) }}</p>
      <p><strong>Progress:</strong>{{ formatTime(currentProgress) }} / {{ formatTime(metadata.duration) }}</p>
      <p><strong>Playback Rate:</strong> {{ metadata.playbackRate }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AudPlayer',
  data() {
    return {
      metadata: null,
      lastFetchedTime: 0,
      lastProgress: 0,
      currentTime: Date.now(),
      metadataIntervalId: null,
      timerIntervalId: null,
    }
  },
  computed: {
    currentProgress() {
      if (!this.metadata) return 0;
      const elapsedSec = (this.currentTime - this.lastFetchedTime) / 1000;
      let computed = this.lastProgress + elapsedSec * this.metadata.playbackRate;
      if (computed > this.metadata.duration) computed = this.metadata.duration;
      return computed;
    },
  },
  methods: {
    // Helper to format seconds into HH:MM:SS (or MM:SS if less than an hour)
    formatTime(seconds) {
      seconds = Math.floor(seconds);
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      const pad = (num) => num.toString().padStart(2, '0');
      return hrs > 0 ? `${hrs}:${pad(mins)}:${pad(secs)}` : `${mins}:${pad(secs)}`;
    },
    async fetchMetadata() {
      try {
        const response = await fetch('http://127.0.0.1:23330/status');
        if (!response.ok) {
          alert(`Service Offline: ${response.status}`);
        }
        const data = await response.json();
        this.metadata = data;
        this.lastFetchedTime = Date.now();
        this.lastProgress = data.progress;
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    },
    initializeMetadataPolling() {
      this.fetchMetadata();
      this.metadataIntervalId = setInterval(this.fetchMetadata, 5000);
      this.timerIntervalId = setInterval(() => {
        this.currentTime = Date.now();
      }, 1000);
    },
  },
  beforeUnmount() {
    if (this.metadataIntervalId) clearInterval(this.metadataIntervalId);
    if (this.timerIntervalId) clearInterval(this.timerIntervalId);
  },
}
</script>