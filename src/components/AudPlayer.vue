<template>
  <div class="p-4">
    <div class="metadata-overlay">
    <div class="bg-gray-100 p-4 rounded shadow" v-if="metadata">
      <p class="bold"><span>{{ metadata.status.charAt(0).toUpperCase() + metadata.status.slice(1) }}: {{ metadata.name }}</span>
        <span v-if="metadata.singer"> / Author: {{ metadata.singer }}</span>
        <span v-if="metadata.albumName"> / Album: {{ metadata.albumName }}</span>
      </p>
      <p class="bold"><span>{{ formatTime(currentProgress) }} / {{ formatTime(metadata.duration) }}</span>
        <span v-if="metadata.playbackRate!==1"> (Playback Rate: {{ metadata.playbackRate }})</span>
      </p>
      <br>
      <p class="lyric" v-if="metadata.lyricLineAllText">{{ metadata.lyricLineAllText }}</p>
    </div>
  </div>
    <iframe :src="rtcServer" frameborder="0" allowfullscreen autoplay playsinline
    style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: 1;"></iframe>
  </div>
</template>

<script>
export default {
  name: 'AudPlayer',
  data() {
    return {
      metadata: null,
      rtcServer: null,
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
      if (this.metadata.status !== 'playing') return this.lastProgress;
      const elapsed = (this.currentTime - this.lastFetchedTime) / 1000;
      let cp = this.lastProgress + elapsed * this.metadata.playbackRate;
      return cp > this.metadata.duration ? this.metadata.duration : cp;
    }
  },
  methods: {
    formatTime(seconds) {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60)
      const ms = Math.floor((seconds - Math.floor(seconds)) * 1000);
      const pad = n => n.toString().padStart(2, '0');
      const padms = n => n.toString().padStart(3, '0');
      return hrs > 0 ? `${hrs}:${pad(mins)}:${pad(secs)}:${padms(ms)}` : `${pad(mins)}:${pad(secs)}:${padms(ms)}`;
    },
    async fetchMetadata() {
      const res = await fetch('/metadata');
      const data = await res.json();
      this.metadata = data;
      this.lastFetchedTime = Date.now();
      this.lastProgress = data.progress;
    },
    async fetchRtcserver(){
      const res = await fetch('/rtc');
      const data = await res.json();
      this.rtcServer = data;
      this.rtcServer = data.rtcServer;
    }
  },
  watch: {
    currentProgress(newVal) {if (this.metadata && newVal >= this.metadata.duration) {this.fetchMetadata()}}},
    
  beforeMount() {
    this.fetchMetadata();
    this.fetchRtcserver();
    this.metadataIntervalId = setInterval(() => this.fetchMetadata(), 1000);
    this.timerIntervalId = setInterval(() => { this.currentTime = Date.now(); }, 1);
  },
  beforeDestroy() {
    clearInterval(this.metadataIntervalId);
    clearInterval(this.timerIntervalId);
  }
}
</script>

<style scoped>
iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.metadata-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  padding: 10px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
}

.bold {
  font-weight: bold;
}

.lyric {
  /* position: absolute;
  right: 30px;
  top: 10px;
  align-self: right; */
  white-space: pre-line;
}

</style>