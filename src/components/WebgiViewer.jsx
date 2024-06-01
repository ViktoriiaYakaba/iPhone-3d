import React, { useRef, useCallback, useState, useImperativeHandle, useEffect } from 'react'
import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    BloomPlugin,
    GammaCorrectionPlugin,
    mobileAndTabletCheck,
} from "webgi";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollAimation } from '../lib/scroll-animation';

gsap.registerPlugin(ScrollTrigger);

const WebgiViewer = () => {
  const canvasRaf = useRef(null);

  const memorizedScrollAnimation = useCallback(
    (position, target, onUdate) => {
      if (position && target && onUdate) {
        scrollAimation(position, target, onUdate);
      }
    },[]
  )

  const setupViewer = useCallback(async () => {
    const viewer = new ViewerApp({
      canvas: canvasRaf.current,
    })
    const manager = await viewer.addPlugin(AssetManagerPlugin);

    const camera = viewer.scene.activeCamera;
    const position = camera.position;
    const target = camera.target;


    await viewer.addPlugin(GBufferPlugin);
    await viewer.addPlugin(new ProgressivePlugin(32));
    await viewer.addPlugin(new TonemapPlugin(true));
    await viewer.addPlugin(GammaCorrectionPlugin);
    await viewer.addPlugin(SSRPlugin);
    await viewer.addPlugin(SSAOPlugin);
    await viewer.addPlugin(BloomPlugin);

    viewer.renderer.refreshPipeline();
    await manager.addFromPath("scene-black.glb");
    viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

    window.scrollTo(0, 0);

    let needsUpdated = true;

    const onUpdate = () => {
      needsUpdated = true;
      viewer.setDirty();
    }

    viewer.addEventListener('preFrame', () => {
      if (needsUpdated) {
        camera.positionTargetUpdated(true);
        needsUpdated = false;
      }
    });
    memorizedScrollAnimation(position, target, onUpdate);
  }, []);
 
  useEffect(() => {
    setupViewer();
  }, []);

  return (
    <div id='webgi-canvas-container'>
      <canvas id='webgi-canvas' ref={canvasRaf} />
    </div>
  )
}

export default WebgiViewer;
