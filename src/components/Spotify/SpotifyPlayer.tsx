"use client";

import React, { useEffect, useState } from "react";

// Definimos interfaces necesarias para el reproductor
interface SpotifyPlayer {
  connect(): Promise<boolean>;
  disconnect(): void;
  addListener(event: SpotifyPlayerEvents, callback: (data: any) => void): void;
  removeListener(
    event: SpotifyPlayerEvents,
    callback?: (data: any) => void
  ): void;
  getCurrentState(): Promise<SpotifyPlaybackState | null>;
  pause(): Promise<void>;
  resume(): Promise<void>;
}

interface SpotifyPlayerOptions {
  name: string;
  getOAuthToken: (cb: (token: string) => void) => void;
}

interface SpotifyPlaybackState {
  paused: boolean;
  track_window: {
    current_track: {
      name: string;
      artists: { name: string }[];
      album: { images: { url: string }[] };
    };
  };
}

type SpotifyPlayerEvents = "ready" | "not_ready" | "player_state_changed";

// Declaramos la interfaz global para el objeto window
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
    };
  }
}

// Define el componente SpotifyPlayer con token como prop
interface SpotifyPlayerProps {
  token: string;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ token }) => {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [trackUri, setTrackUri] = useState<string>(
    "spotify:track:4uLU6hMCjMI75M1A2tKUQC"
  ); // URI de ejemplo de una canción
  const [isPaused, setIsPaused] = useState(true);

  // Cargar el SDK de Spotify
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Mi Reproductor de Spotify",
        getOAuthToken: (cb) => cb(token), // Token de autenticación
      });

      setPlayer(spotifyPlayer);

      // Escuchar cuando el reproductor está listo
      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("Reproductor listo con Device ID", device_id);
        setDeviceId(device_id); // Guardar el deviceId
      });

      // Escuchar cuando el reproductor no está listo
      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Dispositivo no está listo", device_id);
      });

      // Escuchar cambios en el estado de la reproducción
      spotifyPlayer.addListener("player_state_changed", (state) => {
        if (!state) return;
        setIsPaused(state.paused);
      });

      // Conectar el reproductor
      spotifyPlayer.connect();
    };

    return () => {
      if (player) {
        player.disconnect(); // Desconectar el reproductor cuando el componente se desmonte
      }
    };
  }, [token, player]);

  // Función para reproducir una canción usando el deviceId
  const playSong = async () => {
    if (!deviceId || !trackUri) {
      console.error("El dispositivo o la URI del track no está disponible");
      return;
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            uris: [trackUri], // Reproduce la canción específica
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        console.log("Canción reproducida correctamente");
      } else {
        console.error("Error al reproducir la canción", response);
      }
    } catch (error) {
      console.error("Error al reproducir la canción", error);
    }
  };

  // Función para pausar/reanudar la reproducción
  const handlePlayPause = () => {
    if (!player) return;
    isPaused ? player.resume() : player.pause();
  };

  return (
    <div>
      <h2>Spotify Web Player</h2>
      <button onClick={playSong} disabled={!deviceId}>
        Reproducir canción
      </button>
      <button onClick={handlePlayPause}>
        {isPaused ? "Reanudar" : "Pausar"}
      </button>
    </div>
  );
};

export default SpotifyPlayer;
