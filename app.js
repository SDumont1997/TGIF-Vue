const app = Vue.createApp({
  data() {
    return {
      members: [],
      ajaxLoader: document.getElementsByClassName("ajax-loader"),
    };
  },
  created() {
    let chamber = "";
    if (document.URL.includes("senate")) {
      chamber = "senate";
    }
    if (document.URL.includes("house")) {
      chamber = "house";
    }

    let endpoint = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`;
    let init = {
      headers: {
        "X-API-Key": "D2aoW3zGtQgRZhQpjzSuDhoQIDZJammdHlFymlEA",
      },
    };

    fetch(endpoint, init)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.members = [...data.results[0].members];
        this.ajaxLoader[0].hidden = true;
      })
      .catch((error) => {
        console.log(error.message);
      });
  },
  methods: {
    
  },
});

app.mount("#app");
