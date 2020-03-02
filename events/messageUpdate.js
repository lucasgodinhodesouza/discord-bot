class MessageUpdateEvent {
  constructor(client) {
    this.client = client;
  }
  async run(oM, nM) {
    if (oM.content === nM.content) return; // If content did not change, just embed was being added, for example.
    this.client.emit("message", nM, true); // 'true' as an indicator that this message was edited.
  }
}

module.exports = MessageUpdateEvent;
