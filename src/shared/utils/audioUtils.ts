export const getPlaylists = () => ({
  nature: ["/audio/nature1.flac", "/audio/nature2.flac"],
  city: ["/audio/city1.flac", "/audio/city2.flac"],
  madcon: ["/audio/Madcon - Beggin.flac", "/audio/Madcon - Freaky Like Me.mp3"],
});

export const getPlaylistData = () => ({
  nature: [
    { id: 1, title: "Get Down on It", url: "/audio/nature1.flac" },
    { id: 2, title: "Let's Groove", url: "/audio/nature2.flac" },
  ],
  city: [
    { id: 1, title: "September", url: "/audio/city1.flac" },
    { id: 2, title: "Boogie Wonderland", url: "/audio/city2.flac" },
  ],
  madcon: [
    { id: 1, title: "Beggin", url: "/audio/Madcon - Beggin.flac" },
    {
      id: 2,
      title: "Freaky Like Me",
      url: "/audio/Madcon - Freaky Like Me.mp3",
    },
  ],
});

export const getPlaylistNames = () => Object.keys(getPlaylists());

export const getPlaylistLabels = () => ({
  nature: "Природа",
  city: "Город",
  madcon: "Madcon",
});

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
