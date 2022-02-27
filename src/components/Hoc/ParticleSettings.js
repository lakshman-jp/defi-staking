import React from "react";
import Particles from "react-tsparticles";

const ParticleSettings = () => {
  return (
    <div>
      <Particles
        height="1000px"
        width="100vw"
        id="tsparticles"
        options={{
          background: {
            color: { value: "#0d47a1" },
          },
          fpslimit: 60,
          interactivity: {
            detect_on: "canvas",
            events: {
              onClick: {
                enable: "true",
                mode: "push",
              },
              onHover: {
                enable: "true",
                mode: "repulse",
              },
              resize: "true",
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
              },
              push: { quantity: 4 },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ParticleSettings;
