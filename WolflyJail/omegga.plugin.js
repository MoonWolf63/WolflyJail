class WolflyJail {
  constructor(omegga, config, store) {
    this.omegga = omegga;
    this.config = config;
    this.store = store;
  }

  async init() {
    this.omegga.on('chatcmd:setjailpos', async (speaker) => {
      if (!this.omegga.getPlayer(speaker).isHost()) {
        this.omegga.whisper(speaker, "Only the host can set the jail position.");
        return;
      }

      const player = this.omegga.getPlayer(speaker);
      if (!player) {
        this.omegga.whisper(speaker, "Could not find player.");
        return;
      }

      const pos = await player.getPosition();
      if (!pos) {
        this.omegga.whisper(speaker, "Could not retrieve your current position.");
        return;
      }

      // Assuming getPosition returns an array [x, y, z]
      // Convert array to an object with x, y, z properties
      const positionObj = { x: pos[0], y: pos[1], z: pos[2] };

      await this.store.set('jailPos', positionObj);
      this.omegga.whisper(speaker, `Jail position set to your current location: ${positionObj.x}, ${positionObj.y}, ${positionObj.z}`);
    });

    this.omegga.on('join', async (player) => {
      if (player.name !== 'rlcbm') return;

      const jailPos = await this.store.get('jailPos');
      if (!jailPos) {
        console.log("WolflyJail >> No jail position set.");
        return;
      }

      setTimeout(() => {
        this.omegga.writeln(`Chat.Command /tp "${player.name}" ${jailPos.x} ${jailPos.y} ${jailPos.z} 0`);
        console.log(`WolflyJail >> user ${player.name} has been TPed to ${jailPos.x} X, ${jailPos.y} Y, ${jailPos.z} Z`);
      }, 5000);
    });
  }

  async stop() {}
}

module.exports = WolflyJail;
