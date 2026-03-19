export const getPlaylists = () => ({
  motivation: [
    "/audio/playlists/motivation/01. GOD OF INK - mpi.flac",
    "/audio/playlists/motivation/01. JEOPARDY.flac",
    "/audio/playlists/motivation/06. NOISEofRAIN.flac",
    "/audio/playlists/motivation/9.01 PARAGON.flac",
  ],
  happy: ["/audio/playlists/happy/05. i-mage.flac"],
  nature: ["/audio/nature1.flac", "/audio/nature2.flac"],
  city: ["/audio/city1.flac", "/audio/city2.flac"],
  madcon: ["/audio/Madcon - Beggin.flac", "/audio/Madcon - Freaky Like Me.mp3"],
});

export const getPlaylistData = () => ({
  motivation: [
    {
      id: 1,
      title: "Hiroyuki Sawano <Vocal: mpi>- GOD OF INK",
      url: "/audio/playlists/motivation/01. GOD OF INK - mpi.flac",
    },
    {
      id: 2,
      title: "SawanoHiroyuki[nZk] - JEOPARDY",
      url: "/audio/playlists/motivation/01. JEOPARDY.flac",
    },
    {
      id: 3,
      title: "SawanoHiroyuki[nZk] - NOISEofRAIN",
      url: "/audio/playlists/motivation/06. NOISEofRAIN.flac",
    },
    {
      id: 4,
      title: "SawanoHiroyuki[nZk] - PARAGON",
      url: "/audio/playlists/motivation/9.01 PARAGON.flac",
    },
  ],
  happy: [
    {
      id: 1,
      title: "SawanoHiroyuki[nZk]:Aimer - i-mage",
      url: "/audio/playlists/happy/05. i-mage.flac",
    },
  ],
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
  motivation: "Мотивация",
  happy: "Счастье",
  nature: "Природа",
  city: "Город",
  madcon: "Madcon",
});

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
