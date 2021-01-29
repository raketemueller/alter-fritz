<template>
  <fieldset>
    <legend>Alter Fr!tz</legend>
    <fritz-box-login @sid="updateSessionId"></fritz-box-login>
    <fritz-box v-if="sid" :sid="sid"></fritz-box>
  </fieldset>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      sid: null,
    };
  },
  methods: {
    updateSessionId(sid) {
      this.sid = sid;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
}
</style>
