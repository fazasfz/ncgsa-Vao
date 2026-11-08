/**
 * Custom hook to initialize and manage an Aladin Lite sky viewer instance.
 * Supports direct FITS band rendering, dynamic cuts, color maps, and SIMBAD overlays.
 * Inputs: options. Returns: containerRef, aladin, isReady, catalogRef.
 */
import { useEffect, useRef, useState } from 'react';
import A from 'aladin-lite';

export const OPTICAL_BASE = 'https://alasky.cds.unistra.fr/DSS/DSSColor';
const INIT_TIMEOUT_MS = 30000;
const aladinInitialization = A.init.then(
  () => ({ ready: true }),
  (error) => ({ ready: false, error }),
);

export const BANDS = {
  Optical: {
    label: 'Optical',
    hips: 'https://alasky.cds.unistra.fr/DSS/DSSColor',
    id: 'CDS/P/DSS2/color',
    format: 'jpeg',
    colorbar: false, // RGB composite — a single-axis scale would misrepresent it
    fallbackOrder: 9,
    wavelength: '400–700 nm',
    telescope: 'DSS2 (Palomar / UK Schmidt)',
    unit: null,
    means:
      'Close to what a large telescope would show your eye. Bright regions are ' +
      'starlight, either emitted directly or reflected off dust.',
  },

  Infrared: {
    label: 'Infrared',
    hips: 'https://alasky.cds.unistra.fr/2MASS/K',
    id: 'CDS/P/2MASS/K',
    format: 'fits',
    colormap: 'inferno',
    stretch: 'asinh',
    colorbar: true,
    fallbackOrder: 9,
    wavelength: '2.2 µm (K band)',
    telescope: '2MASS',
    unit: 'counts / pixel',
    means:
      'Heat, not visible light. Infrared passes through dust that blocks optical ' +
      'light, so bright pixels are warm dust and newborn stars still buried inside ' +
      'their birth cloud.',
  },

  UV: {
    label: 'UV',
    hips: 'https://alasky.cds.unistra.fr/GALEX/GALEXGR6_7_NUV',
    id: 'CDS/P/GALEXGR6_7/NUV',
    format: 'fits',
    colormap: 'plasma',
    stretch: 'asinh',
    colorbar: true,
    overlayOnOptical: true,
    fallbackOrder: 8,
    wavelength: '231 nm (near-UV)',
    telescope: 'GALEX All-Sky Imaging Survey',
    unit: 'counts s⁻¹ / pixel',
    means:
      'Emitted almost only by very hot, very young, very massive stars. Bright ' +
      'pixels mark active star formation; old cool stars are invisible here.',
  },

  'X-ray': {
    label: 'X-ray',
    hips: 'https://alasky.cds.unistra.fr/RASS',
    id: 'CDS/P/RASS',
    format: 'fits',
    colormap: 'magma',
    stretch: 'sqrt',
    colorbar: true,
    fallbackOrder: 3,
    wavelength: '0.1–2.4 keV',
    telescope: 'ROSAT All-Sky Survey',
    unit: 'photon counts / pixel',
    means:
      'Each pixel counts individual X-ray photons. Only gas at millions of degrees ' +
      'emits here — stellar coronae, supernova shocks, neutron stars, black holes. ' +
      'The grain is real: there are simply very few photons.',
  },

  Radio: {
    label: 'Radio',
    hips: 'https://alasky.cds.unistra.fr/NVSS/intensity',
    id: 'CDS/P/NVSS',
    format: 'fits',
    colormap: 'viridis',
    stretch: 'asinh',
    colorbar: true,
    fallbackOrder: 5,
    wavelength: '1.4 GHz (21 cm)',
    telescope: 'NVSS (VLA)',
    unit: 'Jy / beam',
    means:
      'Traces electrons spiralling in magnetic fields (synchrotron) and ionised ' +
      'hydrogen gas — jets, supernova remnants, H II regions.',
  },
};

export const BAND_ORDER = ['Optical', 'Infrared', 'UV', 'X-ray', 'Radio'];

// Approximations of the matplotlib colormaps, for the CSS legend gradient.
export const CSS_COLORMAPS = {
  inferno: ['#000004', '#420a68', '#932667', '#dd513a', '#fca50a', '#fcffa4'],
  magma: ['#000004', '#3b0f70', '#8c2981', '#de4968', '#fe9f6d', '#fcfdbf'],
  plasma: ['#0d0887', '#6a00a8', '#b12a90', '#e16462', '#fca636', '#f0f921'],
  viridis: ['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725'],
};

/**
 * Each survey stores its finest detail at a fixed HEALPix order. Past that there
 * is no more information and zooming just magnifies square cells — which is what
 * made X-ray and radio look like blocks. A pixel at effective order k subtends
 * about 58.63° / 2^k, where effective order = hips_order + log2(tileSize).
 */
export function nativePixelScaleDeg(order, tileSize = 512) {
  return 58.63 / 2 ** (order + Math.log2(tileSize));
}

function makeLayer(band) {
  return A.imageHiPS(band.hips, {
    name: band.label,
    imgFormat: band.format,
    colormap: band.colormap ?? 'native',
    stretch: band.stretch ?? 'linear',
  });
}

/**
 * Swap the displayed survey and return what the colour bar needs.
 */
export async function applyBand(aladin, bandKey) {
  const band = BANDS[bandKey];
  if (!aladin || !band) return null;

  let layer;

  if (band.overlayOnOptical) {
    // GALEX is a mosaic of circular pointings with real gaps between them. With
    // FITS tiles the no-data pixels are NaN and render transparent, so keeping
    // DSS underneath means the gaps show stars instead of a slab of blue.
    aladin.setBaseImageLayer(A.imageHiPS(OPTICAL_BASE, { imgFormat: 'jpeg' }));
    layer = makeLayer(band);
    aladin.setOverlayImageLayer(layer, 'band');
  } else {
    try {
      aladin.removeImageLayer('band');
    } catch {
      /* no overlay present */
    }
    layer = makeLayer(band);
    aladin.setBaseImageLayer(layer);
  }

  // Aladin resolves HiPS properties asynchronously. Poll rather than using a
  // fixed timeout — a survey whose first mirror fails over can take a while.
  let cuts = null;
  let order = band.fallbackOrder;

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250));
    if (!layer) break;

    try {
      if (band.format === 'fits') layer.setImageFormat('fits');
    } catch {
      console.warn(`[deepSky] ${band.hips} has no FITS tiles; colour bar disabled`);
      band.colorbar = false;
    }

    if (band.colormap) {
      layer.setColormap(band.colormap, { stretch: band.stretch ?? 'linear' });
    }

    const detected = layer.maxOrder ?? layer.properties?.hipsOrder;
    if (detected) order = detected;

    const c = layer.getCuts?.();
    if (c && Number.isFinite(c[0]) && Number.isFinite(c[1]) && c[1] > c[0]) {
      // Pull the high cut in so one hot pixel doesn't wash out the frame.
      const hi = c[0] + (c[1] - c[0]) * 0.85;
      layer.setCuts(c[0], hi);
      cuts = [c[0], hi];
      break;
    }
  }
    // Survey default cuts are global — tuned for the brightest source anywhere in
  // the survey. On a faint target that crushes everything to the bottom of the
  // colormap. Sample what's actually on screen instead.
  if (band.colorbar && layer?.readPixel) {
    const [w, h] = aladin.getSize();
    const vals = [];
    for (let sx = 0; sx < 40; sx++) {
      for (let sy = 0; sy < 30; sy++) {
        try {
          const v = layer.readPixel(
            Math.floor((sx + 0.5) * w / 40),
            Math.floor((sy + 0.5) * h / 30)
          );
          if (Number.isFinite(v)) vals.push(v);
        } catch { /* outside the layer */ }
      }
    }
    if (vals.length > 50) {
      vals.sort((a, b) => a - b);
      const lo = vals[Math.floor(vals.length * 0.05)];
      const hi = vals[Math.floor(vals.length * 0.99)];
      if (hi > lo) {
        layer.setCuts(lo, hi);
        cuts = [lo, hi];
      }
    }
  }

  const tileSize = layer?.tileSize ?? layer?.properties?.hipsTileWidth ?? 512;
  const px = nativePixelScaleDeg(order, tileSize);
  const viewWidth = aladin.getSize?.()?.[0] ?? 1000;
  const minFov = px * (viewWidth / 3); // one survey pixel ≈ 3 screen pixels

  aladin.setFoVRange(minFov, 180);
  if (aladin.getFov()[0] < minFov) aladin.setFoV(minFov);

  return { cuts, order, tileSize, layer, minFov };
}

export function useAladin(options = {}) {
  const containerRef = useRef(null);
  const catalogRef = useRef(null);
  const [aladin, setAladin] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    let timeoutId;
    const initTimeout = new Promise((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error('Aladin initialization timed out.')),
        INIT_TIMEOUT_MS,
      );
    });

    Promise.race([aladinInitialization, initTimeout])
      .then((result) => {
        if (!result.ready) throw result.error;
        if (cancelled || !containerRef.current) return;

        const instance = A.aladin(containerRef.current, {
          survey: options.survey || OPTICAL_BASE,
          fov: options.fov || 60,
          target: options.target || '0 0',
          cooFrame: options.cooFrame || 'ICRS',
          showReticle: true,
          showZoomControl: true,
          showFullscreenControl: true,
          showSimbadPointerControl: true,
          showCooGridControl: true,
          showCooGrid: true,
          ...options,
        });

        setAladin(instance);
        setIsReady(true);
      })
      .catch((error) => {
        if (!cancelled) {
          setInitError(error instanceof Error ? error.message : String(error));
        }
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      setIsReady(false);
      setAladin(null);
    };
  }, []); // run once on mount

  return { containerRef, aladin, isReady, initError, catalogRef };
}