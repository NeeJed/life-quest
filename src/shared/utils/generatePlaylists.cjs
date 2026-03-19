const fs = require("fs");
const path = require("path");

const playlistsDir = path.join(__dirname, "../../../public/audio/playlists");
const outputFile = path.join(__dirname, "../../../public/playlists.json");

const generatePlaylists = () => {
  const playlists = {};

  if (fs.existsSync(playlistsDir)) {
    const playlistFolders = fs
      .readdirSync(playlistsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    playlistFolders.forEach((folder) => {
      const folderPath = path.join(playlistsDir, folder);
      const files = fs
        .readdirSync(folderPath)
        .filter(
          (file) =>
            file.endsWith(".mp3") ||
            file.endsWith(".flac") ||
            file.endsWith(".wav"),
        )
        .sort();

      playlists[folder] = files.map((file, index) => ({
        id: index + 1,
        title: path.parse(file).name.replace(/^\d+\.\s*/, ""), // Убираем номер из названия
        url: `/audio/playlists/${folder}/${file}`,
      }));
    });
  }

  fs.writeFileSync(outputFile, JSON.stringify(playlists, null, 2));
  console.log("Playlists generated!");
};

generatePlaylists();
