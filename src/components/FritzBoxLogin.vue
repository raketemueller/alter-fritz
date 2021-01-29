<template>
  <fieldset v-if="session.sid">
    <legend>Session</legend>
    <p>{{ credentials.usr }} (sid: {{ session.sid }})</p>
    <p><button @click="logout(session.sid)">logout</button></p>
  </fieldset>
  <fieldset v-else>
    <legend>Login FRITZ!Box</legend>
    <p><input placeholder="user name" v-model.lazy="credentials.usr" /></p>
    <p>
      <input
        placeholder="password"
        v-model.lazy="credentials.pwd"
        type="password"
        @keypress.enter="login()"
      />
    </p>
    <p>{{ credentials.challenge }}</p>
    <button @click="login()">login</button>
  </fieldset>
</template>

<script>
import { createHash } from "crypto";

export default {
  emits: ["sid"],
  data() {
    return {
      credentials: {
        usr: null,
        pwd: null,
        challenge: null,
      },
      session: {
        id: null,
        info: null,
      },
    };
  },
  computed: {
    challenge_response: function() {
      const challenge = this.credentials.challenge;
      const pwd = this.credentials.pwd;

      return `${challenge}-${this.md5(`${challenge}-${pwd}`)}`;
    },
  },
  mounted() {
    this.credentials.usr = sessionStorage.getItem("usr");
    const sid = sessionStorage.getItem("sid");
    if (sid) {
      this.verifySid(sid);
    } else {
      this.requestChallenge();
    }
  },
  methods: {
    verifySid(sid) {
      this.$http
        .get(`api/fritz/box/login_sid.lua?sid=${sid}`)
        .then(this.setupSession)
        .catch(console.log);
    },

    requestChallenge() {
      return this.$http
        .get(`api/fritz/box/login_sid.lua`)
        .then((json) => {
          this.credentials.challenge = json.SessionInfo.Challenge;
        })
        .catch(console.log);
    },

    async login() {
      if (this.credentials.challenge == null) {
        await this.requestChallenge();
      }

      this.$http
        .get(
          `api/fritz/box/login_sid.lua?username=${this.credentials.usr}&response=${this.challenge_response}`
        )
        .then(this.setupSession)
        .catch(console.log);

      // reset form values
      this.credentials.pwd = null;
      this.credentials.challenge = null;
    },

    logout(sid) {
      this.$http
        .get(`api/fritz/box/login_sid.lua?logout=${sid}`)
        .then((json) => {
          // set new challenge
          this.credentials.challenge = json.SessionInfo.Challenge;

          // reset session values
          this.session = {};
          sessionStorage.removeItem("usr"); // remove usr from session storage
          sessionStorage.removeItem("sid"); // remove sessid from session storage
          this.$emit("sid", null); // emit info that session is closed
        })
        .catch(console.log);
    },

    setupSession(json) {
      if (json.SessionInfo.SID == "0000000000000000") {
        // console.log(`invalid session: ${JSON.stringify(json)}`)
        return;
      }

      this.session.sid = json.SessionInfo.SID;
      this.session.info = json.SessionInfo;

      sessionStorage.setItem("usr", this.credentials.usr);
      sessionStorage.setItem("sid", this.session.sid);
      this.$emit("sid", this.session.sid);
    },

    md5(txt) {
      return createHash("md5")
        .update(Buffer.from(txt, "UTF-16LE"))
        .digest("hex");
    },
  },
};
</script>

<style scoped>
fieldset {
  text-align: center;
}
</style>
