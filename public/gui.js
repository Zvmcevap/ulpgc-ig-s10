import { GUI } from "three/examples/jsm/libs/dat.gui.module";

export function getGuiControls() {
  const gui = new GUI();
  const guiControls = {
    wireframe: true,
    heightSegments: 50,
    widthSegments: 50,
    rollSpeed: 1,
  };

  const camControlsFolder = gui.addFolder("Camera controls");
  camControlsFolder.add(guiControls, "heightSegments").step(1).min(1).max(1000);
  camControlsFolder.add(guiControls, "widthSegments").step(1).min(1).max(1000);
  camControlsFolder.add(guiControls, "rollSpeed").step(1).min(1).max(10);
  camControlsFolder.add(guiControls, "wireframe").name("wireframe");
  return guiControls;
}
